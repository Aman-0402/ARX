import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const modules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline'],
    ['link', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['clean'],
  ],
}

export default function RichTextEditor({ value, onChange, placeholder }) {
  return (
    <div className="rich-editor rounded-xl border border-slate-200 bg-paper focus-within:border-amber">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
      />
    </div>
  )
}
