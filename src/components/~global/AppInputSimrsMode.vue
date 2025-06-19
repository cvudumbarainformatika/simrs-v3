<template>
  <!-- Existing input -->
  <q-input v-if="type !== 'wysiwyg'" ref="appInputSimrsMode" v-bind="$props" @update:model-value="updatedModel" :rules="[
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
  <div v-else class="app-wysiwyg-editor full-width q-pa-none overflow-hidden">
    <div class="editor-toolbar bg-grey-2 rounded-borders ">
      <div v-if="!view" class="row items-center">
        <!-- Add Import Button -->
        <div class="col-auto flex">
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

        <q-separator vertical />

        <!-- Text Style -->
        <div class="col-auto">
          <q-btn-group flat>
            <q-btn flat dense :color="editor?.isActive('heading', { level: 2 }) ? 'secondary' : 'grey-8'"
              icon="icon-mat-menu" @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()">
              <q-tooltip>Heading</q-tooltip>
            </q-btn>
            <q-btn flat dense :color="editor?.isActive('bold') ? 'secondary' : 'grey-8'" icon="icon-mat-format_bold"
              @click="editor?.chain().focus().toggleBold().run()">
              <q-tooltip>Bold</q-tooltip>
            </q-btn>
            <q-btn flat dense :color="editor?.isActive('italic') ? 'secondary' : 'grey-8'" icon="icon-mat-format_italic"
              @click="editor?.chain().focus().toggleItalic().run()">
              <q-tooltip>Italic</q-tooltip>
            </q-btn>
          </q-btn-group>
        </div>

        <q-separator vertical />

        <!-- Alignment -->
        <div class="col-auto">
          <q-btn-group flat>
            <q-btn flat dense :color="editor?.isActive({ textAlign: 'left' }) ? 'secondary' : 'grey-8'"
              icon="icon-mat-format_align_left" @click="editor?.chain().focus().setTextAlign('left').run()">
              <q-tooltip>Align Left</q-tooltip>
            </q-btn>
            <q-btn flat dense :color="editor?.isActive({ textAlign: 'center' }) ? 'secondary' : 'grey-8'"
              icon="icon-mat-format_align_center" @click="editor?.chain().focus().setTextAlign('center').run()">
              <q-tooltip>Center</q-tooltip>
            </q-btn>
            <q-btn flat dense :color="editor?.isActive({ textAlign: 'right' }) ? 'secondary' : 'grey-8'"
              icon="icon-mat-format_align_right" @click="editor?.chain().focus().setTextAlign('right').run()">
              <q-tooltip>Align Right</q-tooltip>
            </q-btn>
          </q-btn-group>
        </div>

        <q-separator vertical />

        <!-- Lists -->
        <div class="col-auto">
          <q-btn-group flat>
            <q-btn flat dense :color="editor?.isActive('bulletList') ? 'secondary' : 'grey-8'"
              icon="icon-mat-format_list_bulleted" @click="editor?.chain().focus().toggleBulletList().run()">
              <q-tooltip>Bullet List</q-tooltip>
            </q-btn>
            <q-btn flat dense :color="editor?.isActive('orderedList') ? 'secondary' : 'grey-8'"
              icon="icon-mat-format_list_numbered" @click="editor?.chain().focus().toggleOrderedList().run()">
              <q-tooltip>Numbered List</q-tooltip>
            </q-btn>
          </q-btn-group>
        </div>

        <q-separator vertical />

        <!-- Table -->
        <div class="col-auto">
          <q-btn flat dense icon="icon-mat-table_view" @click="insertTable">
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

    <div class="q-pa-xs" :class="{
      'editor-disabled': disable,
      'editor-error': hasError,
      'editor-warning': showWarning,
      'editor-content': !disable
    }">
      <editor-content :editor="editor" />

      <!-- Error Message -->
      <div v-if="hasError" class="text-negative text-caption q-mt-sm">
        {{ errorMessage }}
      </div>

      <!-- Warning/Helper Text -->
      <div v-else-if="showWarning" class="text-warning text-caption q-mt-sm">
        {{ warningMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
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
    default: 'wysiwyg' // text, wysiwyg
  },
  valid: {
    type: Object,
    default: () => ({})
  },
  modelValue: {
    type: String,
    default: ''
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
  },
  view: {
    type: Boolean,
    default: false
  }

})

const emits = defineEmits(['appendClick', 'update:modelValue', 'plaintext:modelValue'])

const appInputSimrsMode = ref(null)

defineExpose({ appInputSimrsMode })

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
  // console.log('Sanitizing HTML:', html);

  const div = document.createElement('div')
  div.innerHTML = html

  const cleanNode = (node) => {
    if (node.nodeType === 1) { // Element node
      // Remove invalid attributes and clean up Word-specific classes
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

      // Handle Word alignment attributes
      if (node.getAttribute('align')) {
        const alignment = node.getAttribute('align')
        node.style.textAlign = alignment
      }

      // Handle Word style-based alignment
      const style = node.getAttribute('style') || ''
      if (style.includes('text-align')) {
        // Preserve text alignment
        node.style.textAlign = style.match(/text-align:\s*(.*?);/)[1]
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

    // Tunggu editor siap dan set content
    await new Promise(resolve => setTimeout(resolve, 100))
    if (editor.value) {
      editor.value.commands.setContent(cleanHtml)

      // Trigger update untuk emit nilai
      const content = editor.value.getHTML()
      const plaintext = editor.value.getText()

      emits('plaintext:modelValue', plaintext)
      emits('update:modelValue', content)
    }

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
      message: 'Failed to import document',
      position: 'top'
    })
  } finally {
    isLoading.value = false
  }
}

// Add watcher for modelValue changes
watch(() => props.modelValue, (newValue) => {
  if (editor.value && (newValue === null || newValue === '')) {
    editor.value.commands.clearContent(true)
  } else if (editor.value && newValue !== editor.value.getHTML()) {
    editor.value.commands.setContent(newValue || '')
  }
})

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
          defaultAlignment: 'left',
          alignments: ['left', 'center', 'right', 'justify']
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
      content: props.modelValue || '', // Set initial content from modelValue
      editable: !props.disable,
      onUpdate: ({ editor }) => {
        const content = editor.getHTML()
        const plaintext = editor.getText()
        // Only emit if content actually changed
        if (content !== props.modelValue) {
          emits('update:modelValue', content === '<p></p>' ? '' : content)
        }
        if (plaintext) {
          emits('plaintext:modelValue', plaintext)
        }
      },
      editorProps: {
        attributes: {
          class: hasError.value ? 'has-error' : ''
        }
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

// Validation computed properties
const hasError = computed(() => {
  if (!props.valid?.required) return false
  return !props.modelValue || props.modelValue.trim().length === 0
})

const errorMessage = computed(() => {
  if (hasError.value) return 'Field ini wajib diisi'
  return ''
})

const showWarning = computed(() => {
  if (props.valid?.minLength && props.modelValue) {
    return props.modelValue.length < props.valid.minLength
  }
  return false
})

const warningMessage = computed(() => {
  if (showWarning.value) {
    return `Minimal ${props.valid.minLength} karakter`
  }
  return ''
})
</script>

<!-- <style lang="scss">
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
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    transition: all 0.3s ease;

    &:hover {
      border-color: #000;
    }

    &:focus-within {
      border-color: #1976d2;
      box-shadow: 0 0 0 1px #1976d2;
    }

    &.editor-error {
      border-color: #C10015;

      &:focus-within {
        box-shadow: 0 0 0 1px #C10015;
      }

      .ProseMirror {
        background-color: rgba(#C10015, 0.03);
      }
    }

    &.editor-warning {
      border-color: #F2C037;

      &:focus-within {
        box-shadow: 0 0 0 1px #F2C037;
      }

      .ProseMirror {
        background-color: rgba(#F2C037, 0.03);
      }
    }
  }

  .ProseMirror {
    outline: none;
    padding: 5px;
    min-height: 200px;
    border-radius: 4px;
    transition: background-color 0.3s ease;

    /* Heading Styles dengan line-height yang lebih kecil */
    h1 {
      font-size: 1.5em;
      font-weight: 600;
      margin: 0.3em 0; // Kurangi margin
      line-height: 1.2; // Tambah line-height yang lebih kecil
    }

    h2 {
      font-size: 1.25em;
      font-weight: 600;
      margin: 0.3em 0;
      line-height: 1.2;
    }

    h3 {
      font-size: 1.17em;
      font-weight: 600;
      margin: 0.3em 0;
      line-height: 1.2;
    }

    h4 {
      font-size: 1em;
      font-weight: 600;
      margin: 0.3em 0;
      line-height: 1.2;
    }

    h5 {
      font-size: 0.83em;
      font-weight: 600;
      margin: 0.3em 0;
      line-height: 1.2;
    }

    h6 {
      font-size: 0.78em;
      font-weight: 600;
      margin: 0.3em 0;
      line-height: 1.2;
    }

    /* Paragraph Style */
    p {
      font-size: 1em;
      margin: 0.5em 0; // Kurangi margin
      line-height: 1; // Sesuaikan line-height

      /* Fix alignment dari Word */
      &[style*="text-align: center"] {
        text-align: center !important;
      }

      &[style*="text-align: right"] {
        text-align: right !important;
      }

      &[style*="text-align: justify"] {
        text-align: justify !important;
      }
    }

    /* Tambahan untuk memastikan alignment bekerja di semua elemen */
    [style*="text-align"] {
      &[style*="center"] {
        text-align: center !important;
      }

      &[style*="right"] {
        text-align: right !important;
      }

      &[style*="justify"] {
        text-align: justify !important;
      }
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

    /* Add these styles for text alignment */
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p {

      /* General alignment styles */
      &[style*="text-align: center"] {
        text-align: center !important;
        display: block !important;
        width: 100% !important;
      }

      &[style*="text-align: right"] {
        text-align: right !important;
        display: block !important;
        width: 100% !important;
      }

      &[style*="text-align: justify"] {
        text-align: justify !important;
        display: block !important;
        width: 100% !important;
      }
    }

    /* Override untuk mammoth import */
    [align="center"] {
      text-align: center !important;
      display: block !important;
      width: 100% !important;
    }

    [align="right"] {
      text-align: right !important;
      display: block !important;
      width: 100% !important;
    }

    /* Tambahan untuk class alignment */
    .is-text-center {
      text-align: center !important;
      display: block !important;
      width: 100% !important;
    }

    .is-text-right {
      text-align: right !important;
      display: block !important;
      width: 100% !important;
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
</style> -->


<style lang="css">
.app-wysiwyg-editor {
  border: 1px solid #ddd;
  border-radius: 8px;
  position: relative;
}

.app-wysiwyg-editor .editor-toolbar {
  border-bottom: 1px solid #ddd;
}

.app-wysiwyg-editor .editor-content {
  min-height: 200px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.app-wysiwyg-editor .editor-content:hover {
  border-color: #000;
}

.app-wysiwyg-editor .editor-content:focus-within {
  border-color: #1976d2;
  box-shadow: 0 0 0 1px #1976d2;
}

.app-wysiwyg-editor .editor-content.editor-error {
  border-color: #C10015;
}

.app-wysiwyg-editor .editor-content.editor-error:focus-within {
  box-shadow: 0 0 0 1px #C10015;
}

.app-wysiwyg-editor .editor-content.editor-error .ProseMirror {
  background-color: rgba(193, 0, 21, 0.03);
}

.app-wysiwyg-editor .editor-content.editor-warning {
  border-color: #F2C037;
}

.app-wysiwyg-editor .editor-content.editor-warning:focus-within {
  box-shadow: 0 0 0 1px #F2C037;
}

.app-wysiwyg-editor .editor-content.editor-warning .ProseMirror {
  background-color: rgba(242, 192, 55, 0.03);
}

.app-wysiwyg-editor .ProseMirror {
  outline: none;
  padding: 5px;
  min-height: 200px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

/* Heading Styles */
.app-wysiwyg-editor .ProseMirror h1 {
  font-size: 1.5em;
  font-weight: 600;
  margin: 0.3em 0;
  line-height: 1.2;
}

.app-wysiwyg-editor .ProseMirror h2 {
  font-size: 1.25em;
  font-weight: 600;
  margin: 0.3em 0;
  line-height: 1.2;
}

.app-wysiwyg-editor .ProseMirror h3 {
  font-size: 1.17em;
  font-weight: 600;
  margin: 0.3em 0;
  line-height: 1.2;
}

.app-wysiwyg-editor .ProseMirror h4 {
  font-size: 1em;
  font-weight: 600;
  margin: 0.3em 0;
  line-height: 1.2;
}

.app-wysiwyg-editor .ProseMirror h5 {
  font-size: 0.83em;
  font-weight: 600;
  margin: 0.3em 0;
  line-height: 1.2;
}

.app-wysiwyg-editor .ProseMirror h6 {
  font-size: 0.78em;
  font-weight: 600;
  margin: 0.3em 0;
  line-height: 1.2;
}

/* Paragraph Style */
.app-wysiwyg-editor .ProseMirror p {
  font-size: 1em;
  margin: 0.5em 0;
  line-height: 1;
}

.app-wysiwyg-editor .ProseMirror p[style*="text-align: center"],
.app-wysiwyg-editor .ProseMirror p[style*="text-align: right"],
.app-wysiwyg-editor .ProseMirror p[style*="text-align: justify"] {
  text-align: inherit !important;
}

/* Tambahan alignment */
.app-wysiwyg-editor .ProseMirror [style*="text-align"]:not(p) {
  text-align: inherit !important;
}

.app-wysiwyg-editor .ProseMirror h1[style*="text-align: center"],
.app-wysiwyg-editor .ProseMirror h2[style*="text-align: center"],
.app-wysiwyg-editor .ProseMirror h3[style*="text-align: center"],
.app-wysiwyg-editor .ProseMirror h4[style*="text-align: center"],
.app-wysiwyg-editor .ProseMirror h5[style*="text-align: center"],
.app-wysiwyg-editor .ProseMirror h6[style*="text-align: center"],
.app-wysiwyg-editor .ProseMirror p[style*="text-align: center"] {
  text-align: center !important;
  display: block !important;
  width: 100% !important;
}

.app-wysiwyg-editor .ProseMirror h1[style*="text-align: right"],
.app-wysiwyg-editor .ProseMirror h2[style*="text-align: right"],
.app-wysiwyg-editor .ProseMirror h3[style*="text-align: right"],
.app-wysiwyg-editor .ProseMirror h4[style*="text-align: right"],
.app-wysiwyg-editor .ProseMirror h5[style*="text-align: right"],
.app-wysiwyg-editor .ProseMirror h6[style*="text-align: right"],
.app-wysiwyg-editor .ProseMirror p[style*="text-align: right"] {
  text-align: right !important;
  display: block !important;
  width: 100% !important;
}

.app-wysiwyg-editor .ProseMirror h1[style*="text-align: justify"],
.app-wysiwyg-editor .ProseMirror h2[style*="text-align: justify"],
.app-wysiwyg-editor .ProseMirror h3[style*="text-align: justify"],
.app-wysiwyg-editor .ProseMirror h4[style*="text-align: justify"],
.app-wysiwyg-editor .ProseMirror h5[style*="text-align: justify"],
.app-wysiwyg-editor .ProseMirror h6[style*="text-align: justify"],
.app-wysiwyg-editor .ProseMirror p[style*="text-align: justify"] {
  text-align: justify !important;
  display: block !important;
  width: 100% !important;
}

/* Mammoth imported alignment */
.app-wysiwyg-editor .ProseMirror [align="center"],
.app-wysiwyg-editor .ProseMirror .is-text-center {
  text-align: center !important;
  display: block !important;
  width: 100% !important;
}

.app-wysiwyg-editor .ProseMirror [align="right"],
.app-wysiwyg-editor .ProseMirror .is-text-right {
  text-align: right !important;
  display: block !important;
  width: 100% !important;
}

/* List styles */
.app-wysiwyg-editor .ProseMirror ul,
.app-wysiwyg-editor .ProseMirror ol {
  margin: 1em 0;
  padding-left: 2em;
}

/* Blockquote */
.app-wysiwyg-editor .ProseMirror blockquote {
  margin: 1em 0;
  padding-left: 1em;
  border-left: 4px solid #ccc;
  color: #666;
}

/* Code block */
.app-wysiwyg-editor .ProseMirror pre {
  background: #f5f5f5;
  padding: 1em;
  border-radius: 4px;
  overflow-x: auto;
}

/* Inline code */
.app-wysiwyg-editor .ProseMirror code {
  background: #f5f5f5;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
}

/* Table */
.app-wysiwyg-editor .ProseMirror table {
  width: 100%;
  border-collapse: collapse;
  margin: 0.5em 0;
}

.app-wysiwyg-editor .ProseMirror table td,
.app-wysiwyg-editor .ProseMirror table th {
  border: 1px solid #ddd;
  padding: 6px 12px;
}

.app-wysiwyg-editor .ProseMirror table th {
  background: #f5f5f5;
  font-weight: bold;
}

/* Manual replacement of @extend */
.app-wysiwyg-editor .text-h1 {
  font-size: 1.5em;
  font-weight: 600;
  margin: 0.3em 0;
  line-height: 1.2;
}

.app-wysiwyg-editor .text-h2 {
  font-size: 1.25em;
  font-weight: 600;
  margin: 0.3em 0;
  line-height: 1.2;
}

.app-wysiwyg-editor .text-h3 {
  font-size: 1.17em;
  font-weight: 600;
  margin: 0.3em 0;
  line-height: 1.2;
}

.app-wysiwyg-editor .text-h4 {
  font-size: 1em;
  font-weight: 600;
  margin: 0.3em 0;
  line-height: 1.2;
}

.app-wysiwyg-editor .text-h5 {
  font-size: 0.83em;
  font-weight: 600;
  margin: 0.3em 0;
  line-height: 1.2;
}

.app-wysiwyg-editor .text-h6 {
  font-size: 0.78em;
  font-weight: 600;
  margin: 0.3em 0;
  line-height: 1.2;
}

.app-wysiwyg-editor .text-body1 {
  font-size: 1em;
  margin: 0.5em 0;
  line-height: 1;
}
</style>