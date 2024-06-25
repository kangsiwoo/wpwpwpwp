import { useState, useEffect } from 'react';
import { getFirestore, doc, setDoc, deleteDoc, collection, getDocs } from "firebase/firestore";

export const useFirestoreForm = (db) => {
    const [docName, setDocName] = useState('');
    const [fields, setFields] = useState([{ key: '', value: '' }]);
    const [property, setProperty] = useState('');
    const [documents, setDocuments] = useState([]);

    const handleDocNameChange = (event) => {
        setDocName(event.target.value);
    };

    const handleFieldChange = (index, event) => {
        const newFields = [...fields];
        newFields[index][event.target.name] = event.target.value;
        setFields(newFields);
    };

    const handlePropertyChange = (event) => {
        setProperty(event.target.value);
    };

    const handleAddField = () => {
        setFields([...fields, { key: '', value: '' }]);
    };

    const handleRemoveField = (index) => {
        const newFields = [...fields];
        newFields.splice(index, 1);
        setFields(newFields);
    };

    const handleButtonClick = async () => {
        if (docName.trim() === '' || fields.some(field => field.key.trim() === '' || field.value.trim() === '')) {
            alert('Please enter document name and all field values.');
            return;
        }

        if (property.trim().toLowerCase() === '_property') {
            alert('You cannot use "_property" as a property name.');
            return;
        }

        const data = {
            timestamp: new Date(),
            _property: property
        };

        fields.forEach(field => {
            data[field.key] = field.value;
        });

        try {
            await setDoc(doc(db, "yourCollectionName", docName), data);
            console.log("Document written with ID: ", docName);
            setDocName('');
            setFields([{ key: '', value: '' }]);
            setProperty('');
            fetchDocuments();
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const fetchDocuments = async () => {
        const querySnapshot = await getDocs(collection(db, "yourCollectionName"));
        const docsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDocuments(docsData);
    };

    const handleDeleteDocument = async (id) => {
        try {
            await deleteDoc(doc(db, "yourCollectionName", id));
            fetchDocuments();
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    return {
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
    };
};
