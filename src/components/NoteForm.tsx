import { FormEvent, useRef, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CreatableReactSelect from 'react-select/creatable'
import { Note, NoteData, Tag } from "../App";
import { v4 } from "uuid";

type NoteFormProps = {
    onSubmit : (data:NoteData) => void
    onAddTag : (data:Tag) => void
    availableTags : Tag[]
} & Partial<NoteData>

export type CreatableSelectType = {
    label : string,
    value: string
}
export default function NoteForm({ onSubmit,onAddTag,availableTags,title='',body='',tags=[] } : NoteFormProps) {
    const titleRef = useRef<HTMLInputElement>(null)
    const markdownRef = useRef<HTMLTextAreaElement>(null)
    const [selectedTags,setSelectedTags] = useState<Tag[]>(tags)
    const navigate = useNavigate()

    function handleSubmit(e: FormEvent){
        e.preventDefault()
        onSubmit({
            title:titleRef.current!.value, //! means that impossible to be null because of required property
            body: markdownRef.current!.value,
            tags:selectedTags  
        })
        navigate('..')
    }



    const handleChange = (newTags:CreatableSelectType[]) : void => {

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

      

  return (
    <>
        <Form onSubmit={handleSubmit}>
            <Stack gap={4}>
                <Row>
                    <Col>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control ref={titleRef} required defaultValue={title}/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="tags">
                            <Form.Label>Tags</Form.Label>
                            <CreatableReactSelect 
                                    onCreateOption={ label => {
                                        const newTag = {id:v4(),label}    
                                        onAddTag(newTag)
                                        setSelectedTags(prevSelectedTags => [...prevSelectedTags ,newTag])
                                    }}
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
                <Form.Group controlId="markdown">
                    <Form.Label>Body</Form.Label>
                    <Form.Control defaultValue={body} ref={markdownRef} required as="textarea" rows={10}/>
                </Form.Group>
                <Stack direction="horizontal" gap={2} className="justify-content-end">
                    <Button type='submit' variant="primary">Save</Button>
                    <Link to='..'>
                        <Button type='button' variant="outline-secondary">Cancel</Button>
                    </Link>
                </Stack>
            </Stack>
        </Form>
    </>
  )
}
