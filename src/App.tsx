import 'bootstrap/dist/css/bootstrap.min.css'
import { Container } from 'react-bootstrap'
import { Routes,Route,Navigate } from 'react-router-dom'
import NewNote from './components/NewNote'
import { useStorage } from './hooks/useStorage'
import { useMemo } from 'react'
import { v4 } from 'uuid'
import NoteList from './components/NoteList'
import NoteLayout from './layouts/NoteLayout'
import Note from './components/Note'
import EditNote from './components/EditNote'
export type Tag = {
  id:string
  label:string
}

export type RawNote = {
  id:string 
} & RawNoteData

export type RawNoteData = {
  title:string
  body:string
  tagIds:string[]
}

export type Note = {
  id:string 
} & NoteData

export type NoteData = {
  title:string
  body:string
  tags:Tag[]
}

export default function App() {
  const [notes,setNotes] = useStorage<RawNote[]>('NOTES',[])
  const [tags,setTags] = useStorage<Tag[]>('TAGS',[])


  const notesWithTags = useMemo(()=>{
        return notes.map(note => {
          return {...note,tags:tags.filter(tag=> note.tagIds.includes(tag.id))}
        })
  },[notes,tags])


  const onCreateNote = ({tags,...data}:NoteData) => {
 
    setNotes(prevNotes => {
      return [...prevNotes,{...data,id:v4(),tagIds: Array.isArray(tags) ? tags.map(tag=>tag.id) : []}]
    })
  }


  function addTag(tag:Tag){
    setTags(prevTags=>[...prevTags,tag])
  }

  function onUpdateNote(id:string , {tags,...data}:NoteData) {
    setNotes(prevNotes => {
      return prevNotes.map(prevNote => {
        if (prevNote.id === id) {
          return { ...prevNote , ...data, tagIds:tags.map(tag=>tag.id)}
        }else{
          return prevNote
        }
      })
    })
  }
  

  function onDeleteNote(id:string){
    setNotes(prevNotes => {
      return prevNotes.filter(prevNote => prevNote.id !== id)
    })
  }

  function updateTag(id:string , label:string){
    setTags(prevTags => {
      return prevTags.map(prevTag => {
        if (prevTag.id === id) {
          return {...prevTag,label}
        }else{
          return prevTag
        }
      })
    })
  }
  function deleteTag(id:string){
    setTags(prevTags => {
      return prevTags.filter(prevTag => prevTag.id !== id)
    })
  }
  return (
    <Container className='my-4'>
      <Routes>
        <Route 
            path='/'
            element={<NoteList 
                          availableTags={tags} 
                          notes={notesWithTags}
                          updateTag={updateTag}
                          deleteTag={deleteTag}
            />} />
        <Route path='/new' element={<NewNote onSubmit={onCreateNote} onAddTag={addTag} availableTags = {tags}/>} />
        <Route path='/:id' element={<NoteLayout notes={notesWithTags}/>}>
          <Route index element={<Note onDeleteNote={onDeleteNote}/>}/>
          <Route path='edit' 
                 element={<EditNote 
                              onSubmit={onUpdateNote} 
                              onAddTag={addTag} 
                              availableTags = {tags}/>}
          />
        </Route>
        <Route path='*' element={<Navigate to='/'/>}/>
      </Routes>
    </Container>
  )
}
