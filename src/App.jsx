import { useState, useEffect, useRef } from 'react';
import './App.css';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { useFirestoreForm } from './Firebase.js';

const firebaseConfig = {
    apiKey: "AIzaSyBRcVZIso5JSYLPlL1hxS_Q_vjl-CKwy0M",
    authDomain: "mydevices-78689.firebaseapp.com",
    projectId: "mydevices-78689",
    storageBucket: "mydevices-78689.appspot.com",
    messagingSenderId: "1026396074428",
    appId: "1:1026396074428:web:31effe38f2f890376d3bb9",
    measurementId: "G-Y3K2V5YFHK"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

function App() {
    const {
        docName,
        fields,
        property,
        documents,
        handleDocNameChange,
        handleFieldChange,
        handlePropertyChange,
        handleAddField,
        handleRemoveField,
        handleButtonClick,
        handleDeleteDocument,
    } = useFirestoreForm(db);

    const [selectedDocument, setSelectedDocument] = useState(null);
    const modalRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setSelectedDocument(null);
            }
            if (event.key === 'Tab') {
                const focusableModalElements = modalRef.current.querySelectorAll(
                    'a[href], button:not([disabled]), textarea, input, select'
                );
                const firstElement = focusableModalElements[0];
                const lastElement = focusableModalElements[focusableModalElements.length - 1];

                if (document.activeElement === firstElement && event.shiftKey) {
                    event.preventDefault();
                    lastElement.focus();
                } else if (document.activeElement === lastElement && !event.shiftKey) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        };

        if (selectedDocument) {
            document.addEventListener('keydown', handleKeyDown);
        } else {
            document.removeEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedDocument]);

    const handleCloseModal = () => {
        setSelectedDocument(null);
    };

    return (
        <div className="App">
            <header>
                <h1>Device Management</h1>
            </header>
            <main>
                <div className="name-input">
                    <label htmlFor="device-name">
                        <h4>이름</h4>
                    </label>
                    <input
                        id="device-name"
                        type="text"
                        value={docName}
                        onChange={handleDocNameChange}
                        placeholder="Enter your Device's name"
                        aria-label="Device name"
                    />
                </div>
                <div className="feature-input">
                    <label htmlFor="property-data">
                        <h4>특징</h4>
                    </label>
                    <input
                        id="property-data"
                        type="text"
                        name="property"
                        value={property}
                        onChange={handlePropertyChange}
                        placeholder="Enter property's data"
                        aria-label="Property data"
                    />
                </div>
                {fields.map((field, index) => (
                    <div key={index}>
                        <input
                            type="text"
                            name="key"
                            value={field.key}
                            onChange={(event) => handleFieldChange(index, event)}
                            placeholder="Enter property"
                            aria-label={`Property key ${index + 1}`}
                        />
                        <input
                            type="text"
                            name="value"
                            value={field.value}
                            onChange={(event) => handleFieldChange(index, event)}
                            placeholder="Enter property's data"
                            aria-label={`Property value ${index + 1}`}
                        />
                        <button className="delete" onClick={() => handleRemoveField(index)} aria-label={`Remove property ${index + 1}`}>X</button>
                    </div>
                ))}
                <button onClick={handleAddField} aria-label="Add new field">Add Field</button>
                <button onClick={handleButtonClick} aria-label="Add to Firestore">Add to Firestore</button>

                <h2>Documents</h2>
                <ul>
                    {documents.map((doc) => (
                        <li key={doc.id}>
                            <strong>{doc.id}</strong>
                            <button className="details" onClick={() => setSelectedDocument(doc)} aria-label={`View details of ${doc.id}`}>Details</button>
                            <button className="remove" onClick={() => handleDeleteDocument(doc.id)} aria-label={`Delete document ${doc.id}`}>Delete</button>
                        </li>
                    ))}
                </ul>

                {selectedDocument && (
                    <div className="modal" role="dialog" aria-modal="true" ref={modalRef}>
                        <div className="modal-content">
                            <button className="close" onClick={handleCloseModal} aria-label="Close modal">X</button>
                            <h2>Document Details</h2>
                            <div className="detail-item">
                                <strong>이름:</strong> {selectedDocument.id}
                            </div>
                            <div className="detail-item">
                                <strong>특징:</strong> {selectedDocument._property}
                            </div>
                            {Object.entries(selectedDocument).map(([key, value]) => {
                                if (key !== 'id' && key !== '_property') {
                                    return (
                                        <div key={key} className="detail-item">
                                            <strong>{key}:</strong> {value.toString()}
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
