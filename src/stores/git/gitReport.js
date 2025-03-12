import { defineStore } from 'pinia'
import { date } from 'quasar'
import axios from 'axios'

export const useGitReportStore = defineStore('git-report', {
  state: () => ({
    loading: false,
    commits: [],
    contributors: [],
    params: {
      from: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      to: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      branch: 'master'
    },
    repoConfig: {
      owner: 'cvudumbarainformatika',
      repo: 'simrs-v3',
      baseURL: 'https://api.github.com',
      token: import.meta.env.VITE_GITHUB_TOKEN
    }
  }),

  getters: {
    sortedContributors() {
      return [...this.contributors].sort((a, b) => b.weeklyCommits - a.weeklyCommits)
    }
  },

  actions: {
    async getGitReport() {
      this.loading = true
      const { owner, repo, baseURL, token } = this.repoConfig

      try {
        const gitApi = axios.create({
          baseURL,
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        })

        const commitsResponse = await gitApi.get(
          `/repos/${owner}/${repo}/commits`,
          {
            params: {
              since: `${this.params.from}T00:00:00Z`,
              until: `${this.params.to}T23:59:59Z`,
              sha: this.params.branch
            }
          }
        )

        // Fetch detailed commit information for each commit
        const commitPromises = commitsResponse.data.map(async commit => {
          const detailResponse = await gitApi.get(`/repos/${owner}/${repo}/commits/${commit.sha}`)
          return {
            hash: commit.sha.substring(0, 7),
            date: date.formatDate(commit.commit.author.date, 'YYYY-MM-DD HH:mm'),
            author: commit.commit.author.name,
            email: commit.commit.author.email,
            message: commit.commit.message,
            url: commit.html_url,
            additions: detailResponse.data.stats.additions,
            deletions: detailResponse.data.stats.deletions,
            files: detailResponse.data.files.length
          }
        })

        this.commits = await Promise.all(commitPromises)

        const statsResponse = await gitApi.get(
          `/repos/${owner}/${repo}/stats/contributors`
        )

        this.contributors = Array.isArray(statsResponse.data) ? statsResponse.data.map(contributor => ({
          name: contributor.author.login,
          avatar: contributor.author.avatar_url,
          totalCommits: contributor.total,
          weeklyCommits: contributor.weeks.reduce((acc, week) => {
            if (new Date(week.w * 1000) >= new Date(this.params.from) &&
              new Date(week.w * 1000) <= new Date(this.params.to)) {
              return acc + week.c
            }
            return acc
          }, 0),
          additions: contributor.weeks.reduce((acc, week) => acc + week.a, 0),
          deletions: contributor.weeks.reduce((acc, week) => acc + week.d, 0)
        })) : []

      } catch (error) {
        console.error('Error fetching git report:', error)
        this.commits = []
        this.contributors = []
      } finally {
        this.loading = false
      }
    },

    async getCommitDetail(hash) {
      const { owner, repo, baseURL, token } = this.repoConfig

      try {
        const gitApi = axios.create({
          baseURL,
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        })

        const response = await gitApi.get(
          `/repos/${owner}/${repo}/commits/${hash}`
        )

        return {
          files: response.data.files.map(file => ({
            filename: file.filename,
            status: file.status,
            additions: file.additions,
            deletions: file.deletions,
            changes: file.changes
          })),
          stats: response.data.stats
        }
      } catch (error) {
        console.error('Error fetching commit detail:', error)
        return null
      }
    }
  }
})