import { Button, Col, Form, Modal, Row, Stack } from "react-bootstrap";
import { Tag } from "../App";

type EditTagsModalProps = {
    availableTags : Tag[],
    show:boolean,
    handleClose: () => void
    deleteTag: (id:string) => void 
    updateTag: (id:string,label:string) => void
}
export default function EditTagsModal({availableTags,show,handleClose,deleteTag,updateTag}:EditTagsModalProps) {
  return (
    <>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Tags</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Stack gap={2}>
                        {availableTags.map(tag=>{
                            return (
                                <Row key={tag.id}>
                                <Col>
                                    <Form.Control type='text' value={tag.label} onChange={(e)=>updateTag(tag.id,e.target.value)}/>
                                </Col>
                                <Col xs='auto'>
                                    <Button variant='outline-danger' onClick={()=>deleteTag(tag.id)}>&times;</Button>
                                </Col>
                            </Row>
                            )
                        })}
                    </Stack>
                </Form>
            </Modal.Body>
        </Modal>
    </>
  )
}
