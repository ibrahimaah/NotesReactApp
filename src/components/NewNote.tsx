import { NoteData, Tag } from "../App";
import NoteForm, { NoteFormProps } from "./NoteForm";

type NewNoteProps = {
  onSubmit : (data:NoteData) => void
  onAddTag : (data:Tag) => void
  availableTags : Tag[]
}

export default function NewNote({onSubmit,onAddTag,availableTags} : NewNoteProps) {
  return (
    <>
      <h1 className="mb-4">New Note</h1>
      <NoteForm onSubmit={onSubmit} onAddTag={onAddTag} availableTags={availableTags}/>
    </>
  )
}
