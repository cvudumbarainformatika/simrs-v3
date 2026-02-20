import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useAdminDashboardStore = defineStore('admin_dashboard', {
    state: () => ({
        loading: false,
        summary: {
            total_pegawai: '0',
            aktif: 0,
            cuti: 0
        },
        adminStats: [
            { label: 'Hadir Tepat Waktu', value: '0', icon: 'icon-mat-check_circle', color: 'green', trendIcon: 'icon-mat-trending_up', trendText: '0% Hadir', trendColor: 'text-green' },
            { label: 'Terlambat', value: '0', icon: 'icon-mat-history', color: 'orange', trendIcon: 'icon-mat-trending_down', trendText: '0% Terlambat', trendColor: 'text-orange' },
            { label: 'Cuti / Libur', value: '0', icon: 'icon-mat-beach_access', color: 'blue', trendIcon: 'icon-mat-remove', trendText: 'Sesuai Prota', trendColor: 'text-grey-7' },
            { label: 'Tanpa Keterangan', value: '0', icon: 'icon-mat-warning', color: 'negative', trendIcon: 'icon-mat-trending_up', trendText: 'Perlu Follow Up', trendColor: 'text-red' }
        ],
        seriesTrend: [{
            name: 'Persentase Kehadiran',
            data: [0, 0, 0, 0, 0, 0, 0]
        }],
        categoriesTrend: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
        seriesDonut: [0, 0, 0, 0]
    }),

    actions: {
        async getData() {
            this.loading = true
            try {
                const resp = await api.get('/v1/pegawai/absensi/dashboard-admin')
                if (resp.status === 200) {
                    const data = resp.data.data
                    this.summary = data.summary || this.summary
                    this.adminStats = data.admin_stats || this.adminStats

                    if (data.weekly_trend) {
                        this.seriesTrend = data.weekly_trend.series
                        this.categoriesTrend = data.weekly_trend.categories
                    }

                    if (data.absence_composition) {
                        this.seriesDonut = data.absence_composition.series
                    }
                }
            } catch (error) {
                console.error('Error fetching dashboard admin data:', error)
            } finally {
                this.loading = false
            }
        }
    }
})
