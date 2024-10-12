import React, { useState } from 'react';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './RichTextStyle.scss'

function RichText() {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

    const handleEditorChange = (state) => {
        setEditorState(state);
    };

    return (
        <div className='RichText-component'>
            <Editor
                editorState={editorState}
                onEditorStateChange={handleEditorChange}
            />
            {/* You can access the raw content state using convertToRaw(editorState.getCurrentContent()) */}
        </div>
    );
}

export default RichText;
