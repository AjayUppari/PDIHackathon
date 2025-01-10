import { useRef } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

function StepOne({ eventData, setEventData }) {
  const quillRef = useRef(null)

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ]
  }

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">
          Event Name
        </label>
        <input
          required
          type="text"
          id="eventName"
          value={eventData.name}
          onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
          className="mt-1 outline-none block w-full rounded-md border-gray-300 border-2 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter event name"
        />
        <label className='mt-4 block text-sm font-medium text-gray-700' htmlFor='teamSize'>Max Team Size</label>
        <input value={eventData.teamSize} onChange={(e) => setEventData({...eventData, teamSize: e.target.value})} type="number" className='mt-1 outline-none block w-full rounded-md p-2 border-gray-300 border-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm' id="teamSize" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rules for the event
        </label>
        <div className="h-64">
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={eventData.rules}
            onChange={(content) => setEventData({ ...eventData, rules: content })}
            modules={modules}
            className="h-48"
          />
        </div>
      </div>

      {/* <div>
        <label className='text-sm font-medium text-gray-700 mb-2 block' htmlFor='eventPoster'>Upload Poster</label>
        <input onChange={(e) => setEventData({...eventData, poster: e.target.files[0]})} type='file' id='eventPoster' />
      </div> */}
    </div>
  )
}

export default StepOne