import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from 'react-select'
import { useMemo, useState } from "react";
import { Note, Tag } from "../App";
import { CreatableSelectType } from "./NoteForm";
import NoteCard from "./NoteCard";
import EditTagsModal from "./EditTagsModal";

type NoteListProps = {
    availableTags : Tag[]
    notes : Note[]
    deleteTag: (id:string) => void 
    updateTag: (id:string,label:string) => void
}

export default function NoteList({availableTags,notes,deleteTag,updateTag} : NoteListProps) {

const [selectedTags,setSelectedTags] = useState<Tag[]>([])
const [title,setTitle] = useState('')
const [show,setShow] = useState(false) //EditTagsModal
const handleClose = () => {
    setShow(false)
}

const handleChange = (newTags:any) : void => {

    setSelectedTags(newTags.map((newTag:CreatableSelectType) => 
    {
        return {id:newTag.value,label :newTag.label}
    }));
  };


function getOptions(){
    if (Array.isArray(availableTags)) {
        return availableTags.map(tag=>{
            return {label:tag.label, value:tag.id}
        })
    }
}


const filteredNotes = useMemo(()=>{
    return notes.filter(note=>{
        return(
            (title === '' || note.title.toLowerCase().includes(title.toLowerCase()) &&
            (selectedTags.length === 0 || selectedTags.every(selectedTag=>
                note.tags.some(noteTag => noteTag.id === selectedTag.id))))
        ) 
    })
},[title,selectedTags,notes])

  return (
    <>
        <Row className="align-items-center mb-4">
            <Col><h1 className="text-primary fw-bold display-5">Notes APP</h1></Col>
            <Col xs='auto'>
                <Stack direction="horizontal" gap={2}>
                    <Link to='/new'>
                        <Button variant="primary">Create</Button>
                    </Link>
                    <Button variant="outline-secondary" onClick={()=>setShow(true)}>
                        Edit Tags
                    </Button>
                </Stack>
            </Col>
        </Row>
        <Form>
            <Row>
                <Col>
                    <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Control 
                            type='text'
                            value={title}
                            onChange={e=>setTitle(e.target.value)}
                         />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="tags">
                        <Form.Label>Tags</Form.Label>
                        <ReactSelect 
                                value={selectedTags.map((tag:Tag)=>
                                        {
                                            return { value:tag.id , label:tag.label }
                                        })
                                    } 
                                onChange={handleChange} 
                                options={getOptions()}
                        isMulti />
                    </Form.Group>
                </Col>
            </Row>
        </Form>
        <Row xs={1} sm={2} lg={3} xl={4} className="mt-4 g-3">
           {
            filteredNotes.map(filteredNote => (
                <Col key={filteredNote.id}>
                    <NoteCard 
                            id={filteredNote.id} 
                            title={filteredNote.title} 
                            tags={filteredNote.tags}/>
                </Col>
            ))
           }                         
        </Row>
        <EditTagsModal 
            show={show} 
            handleClose={handleClose} 
            availableTags={availableTags}
            deleteTag={deleteTag}
            updateTag={updateTag}
        />
    </>
  )
}
