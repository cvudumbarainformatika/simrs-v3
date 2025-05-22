<template>
  <!-- Existing input -->
  <q-input v-if="type !== 'wysiwyg'" ref="appInputSimrs" v-bind="$props" @update:model-value="updatedModel" :rules="[
    requiredRule,
    minRule,
    maxRule,
    emailRule,
    isNumberRule
  ]">
    <template v-if="append" #append>
      <q-icon v-if="!appendBtn" :name="appendIcon" size="xs" class="cursor-pointer" v-ripple
        @click="emits('appendClick')" />
      <q-btn v-if="appendBtn" :label="appendBtnLabel" outline color="primary" size="sm" v-ripple
        @click="emits('appendClick')" />
    </template>
  </q-input>

  <!-- WYSIWYG Editor -->
  <div v-else class="app-wysiwyg-editor">
    <div class="editor-toolbar bg-grey-2 rounded-borders">
      <div class="row q-col-gutter-sm items-center">
        <!-- Add Import Button -->
        <div class="col-auto">
          <q-btn-dropdown flat dense icon="icon-mat-upload_file" label="Import">
            <q-list>
              <q-item clickable v-close-popup @click="triggerFileInput">
                <q-item-section avatar>
                  <q-icon name="icon-mat-description" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Import from Word</q-item-label>
                  <q-item-label caption>Upload .docx file</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <!-- Hidden file input -->
          <input type="file" ref="fileInput" accept=".docx" style="display: none" @change="handleFileUpload">
        </div>

        <q-separator vertical inset />

        <!-- Text Style -->
        <div class="col-auto">
          <q-btn-group flat>
            <q-btn flat dense :color="editor?.isActive('heading', { level: 2 }) ? 'primary' : 'grey-8'"
              icon="icon-mat-title" @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()">
              <q-tooltip>Heading</q-tooltip>
            </q-btn>
            <q-btn flat dense :color="editor?.isActive('bold') ? 'primary' : 'grey-8'" icon="icon-mat-format_bold"
              @click="editor?.chain().focus().toggleBold().run()">
              <q-tooltip>Bold</q-tooltip>
            </q-btn>
            <q-btn flat dense :color="editor?.isActive('italic') ? 'primary' : 'grey-8'" icon="icon-mat-format_italic"
              @click="editor?.chain().focus().toggleItalic().run()">
              <q-tooltip>Italic</q-tooltip>
            </q-btn>
          </q-btn-group>
        </div>

        <q-separator vertical inset />

        <!-- Alignment -->
        <div class="col-auto">
          <q-btn-group flat>
            <q-btn flat dense :color="editor?.isActive({ textAlign: 'left' }) ? 'primary' : 'grey-8'"
              icon="icon-mat-format_align_left" @click="editor?.chain().focus().setTextAlign('left').run()">
              <q-tooltip>Align Left</q-tooltip>
            </q-btn>
            <q-btn flat dense :color="editor?.isActive({ textAlign: 'center' }) ? 'primary' : 'grey-8'"
              icon="icon-mat-format_align_center" @click="editor?.chain().focus().setTextAlign('center').run()">
              <q-tooltip>Center</q-tooltip>
            </q-btn>
            <q-btn flat dense :color="editor?.isActive({ textAlign: 'right' }) ? 'primary' : 'grey-8'"
              icon="icon-mat-format_align_right" @click="editor?.chain().focus().setTextAlign('right').run()">
              <q-tooltip>Align Right</q-tooltip>
            </q-btn>
          </q-btn-group>
        </div>

        <q-separator vertical inset />

        <!-- Lists -->
        <div class="col-auto">
          <q-btn-group flat>
            <q-btn flat dense :color="editor?.isActive('bulletList') ? 'primary' : 'grey-8'"
              icon="icon-mat-format_list_bulleted" @click="editor?.chain().focus().toggleBulletList().run()">
              <q-tooltip>Bullet List</q-tooltip>
            </q-btn>
            <q-btn flat dense :color="editor?.isActive('orderedList') ? 'primary' : 'grey-8'"
              icon="icon-mat-format_list_numbered" @click="editor?.chain().focus().toggleOrderedList().run()">
              <q-tooltip>Numbered List</q-tooltip>
            </q-btn>
          </q-btn-group>
        </div>

        <q-separator vertical inset />

        <!-- Table -->
        <div class="col-auto">
          <q-btn flat dense icon="icon-mat-table_chart" @click="insertTable">
            <q-tooltip>Insert Table</q-tooltip>
          </q-btn>
        </div>

        <!-- Clear Format -->
        <div class="col-auto q-ml-auto">
          <q-btn flat dense icon="icon-mat-format_clear"
            @click="editor?.chain().focus().clearNodes().unsetAllMarks().run()">
            <q-tooltip>Clear Format</q-tooltip>
          </q-btn>
        </div>

        <!-- Heading Dropdown -->
        <div class="col-auto">
          <q-btn-dropdown flat dense icon="icon-mat-text_fields" label="Heading">
            <q-list>
              <q-item v-for="level in 6" :key="level" clickable v-close-popup
                @click="editor?.chain().focus().toggleHeading({ level }).run()"
                :active="editor?.isActive('heading', { level })">
                <q-item-section>
                  <div :class="`text-h${level}`">Heading {{ level }}</div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <q-inner-loading :showing="isLoading">
      <q-spinner-dots size="50px" color="primary" />
    </q-inner-loading>

    <div class="editor-content" :class="{ 'editor-disabled': disable }">
      <editor-content :editor="editor" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { useQuasar } from 'quasar'

const props = defineProps({
  label: {
    type: String,
    default: 'Label'
  },
  autofocus: {
    type: Boolean,
    default: true
  },
  readonly: {
    type: Boolean,
    default: false
  },
  disable: {
    type: Boolean,
    default: false
  },
  append: {
    type: Boolean,
    default: false
  },
  appendIcon: {
    type: String,
    default: 'icon-mat-close'
  },
  appendBtn: {
    type: Boolean,
    default: false
  },
  appendBtnLabel: {
    type: String,
    default: 'Cek'
  },
  classTambahan: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  valid: {
    type: Object,
    default: null
  },
  lazyRules: {
    type: [Boolean, String],
    default: true
  },
  hint: {
    type: String,
    default: null
  },
  errorFromServer: {
    type: [Array, Object, Boolean],
    default: null
  }

})

const emits = defineEmits(['appendClick', 'update:modelValue'])

const appInputSimrs = ref(null)

defineExpose({ appInputSimrs })

const requiredRule = (val) => {
  if (props.valid === null) {
    return true
  }
  if (props.valid?.canEmpty) {
    return true
  }
  return (!!val || props.valid?.required || val === 0) || 'Harap diisi'
}

const minRule = (val) => {
  if (props.valid === null) {
    return true
  }
  if (!props.valid?.min) {
    return true
  }
  return (val && val?.length >= parseInt(props.valid?.min)) || `Min ${props.valid?.min} char`
}

const maxRule = (val) => {
  if (props.valid === null) {
    return true
  }
  if (!props.valid?.max || val?.length === 0) {
    return true
  }
  return (val && val?.length <= parseInt(props.valid?.max)) || `Max ${props.valid?.max} char`
}

const emailRule = (val) => {
  if (props.valid === null) {
    return true
  }
  if (!props.valid?.email) {
    return true
  }
  return isValidMail(val) || 'email tidak valid'
}

const isNumberRule = (val) => {
  if (props.valid === null) {
    return true
  }
  if (!props.valid?.number) {
    return true
  }
  return (!isNaN(val) && !isNaN(parseFloat(val))) || 'Harus angka'
}

const isValidMail = (val) => {
  const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
  return emailPattern.test(val)
}

const updatedModel = (e) => {
  emits('update:modelValue', e)
}

const editor = ref(null)
const textColor = ref('#000000')
const $q = useQuasar()
const fileInput = ref(null)
const isLoading = ref(false)

// Add this utility function at the top of script setup
const sanitizeHtml = (html) => {
  // Create a temporary div to parse HTML
  const div = document.createElement('div')
  div.innerHTML = html

  // Remove invalid attributes and clean up Word-specific classes
  const cleanNode = (node) => {
    if (node.nodeType === 1) { // Element node
      // Remove numeric attributes
      Array.from(node.attributes).forEach(attr => {
        if (/^\d+$/.test(attr.name)) {
          node.removeAttribute(attr.name)
        }
      })

      // Remove Word-specific classes
      if (node.hasAttribute('class')) {
        const classes = node.getAttribute('class')
          .split(' ')
          .filter(cls => !cls.startsWith('Mso'))
          .join(' ')
        if (classes) {
          node.setAttribute('class', classes)
        } else {
          node.removeAttribute('class')
        }
      }

      // Clean child nodes
      Array.from(node.children).forEach(cleanNode)
    }
  }

  cleanNode(div)
  return div.innerHTML
}

// Trigger file input click
const triggerFileInput = () => {
  fileInput.value.click()
}

// Handle file upload
const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    isLoading.value = true
    const mammoth = await import('mammoth')
    const arrayBuffer = await file.arrayBuffer()

    const result = await mammoth.convertToHtml({ arrayBuffer })
    const cleanHtml = sanitizeHtml(result.value)

    // Set sanitized content
    editor.value?.commands.setContent(cleanHtml)

    event.target.value = null
    $q.notify({
      type: 'positive',
      message: 'Document imported successfully',
      position: 'top'
    })
  } catch (error) {
    console.error('Error importing document:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to import document. Please check file format.',
      position: 'top'
    })
  } finally {
    isLoading.value = false
  }
}

// Initialize editor when component is mounted
onMounted(() => {
  if (props.type === 'wysiwyg') {
    editor.value = new Editor({
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3, 4, 5, 6],
            HTMLAttributes: {
              class: (level) => `text-h${level}`  // Dynamic class based on level
            }
          },
          paragraph: {
            HTMLAttributes: {
              class: 'text-body1'
            }
          }
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Image,
        TextStyle,
        Color,
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
      ],
      content: '',
      onUpdate: ({ editor }) => {
        emits('update:modelValue', editor.getHTML())
      }
    })
  }
})

// Clean up editor on unmount
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})

const insertTable = () => {
  editor.value?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
}

const setColor = (color) => {
  editor.value?.chain().focus().setColor(color).run()
}
</script>

<style lang="scss">
/* Hapus 'scoped' agar style bisa mempengaruhi konten editor */
.app-wysiwyg-editor {
  border: 1px solid #ddd;
  border-radius: 8px;
  position: relative; // For loading overlay

  .editor-toolbar {
    border-bottom: 1px solid #ddd;
  }

  .editor-content {
    min-height: 200px;

    &.editor-disabled {
      opacity: 0.7;
      pointer-events: none;
      background: #f5f5f5;
    }
  }

  .ProseMirror {
    outline: none;
    padding: 12px;
    min-height: 200px;

    /* Heading Styles */
    h1 {
      font-size: 2em;
      font-weight: 600;
      margin: 0.67em 0;
    }

    h2 {
      font-size: 1.5em;
      font-weight: 600;
      margin: 0.83em 0;
    }

    h3 {
      font-size: 1.17em;
      font-weight: 600;
      margin: 1em 0;
    }

    h4 {
      font-size: 1em;
      font-weight: 600;
      margin: 1.33em 0;
    }

    h5 {
      font-size: 0.83em;
      font-weight: 600;
      margin: 1.67em 0;
    }

    h6 {
      font-size: 0.67em;
      font-weight: 600;
      margin: 2.33em 0;
    }

    /* Paragraph Style */
    p {
      margin: 1em 0;
      line-height: 1.5;
    }

    /* List Styles */
    ul,
    ol {
      margin: 1em 0;
      padding-left: 2em;
    }

    /* Blockquote Style */
    blockquote {
      margin: 1em 0;
      padding-left: 1em;
      border-left: 4px solid #ccc;
      color: #666;
    }

    /* Code Block Style */
    pre {
      background: #f5f5f5;
      padding: 1em;
      border-radius: 4px;
      overflow-x: auto;
    }

    /* Inline Code Style */
    code {
      background: #f5f5f5;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: monospace;
    }

    /* Table Styles */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 0.5em 0;

      td,
      th {
        border: 1px solid #ddd;
        padding: 6px 12px;
      }

      th {
        background: #f5f5f5;
        font-weight: bold;
      }
    }
  }

  /* Custom Typography Classes */
  .text-h1 {
    @extend h1;
  }

  .text-h2 {
    @extend h2;
  }

  .text-h3 {
    @extend h3;
  }

  .text-h4 {
    @extend h4;
  }

  .text-h5 {
    @extend h5;
  }

  .text-h6 {
    @extend h6;
  }

  .text-body1 {
    @extend p;
  }
}
</style>
