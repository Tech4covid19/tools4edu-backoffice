import React from 'react';
import gql from 'graphql-tag';
import {useMutation, useQuery} from '@apollo/react-hooks';
import MaterialTable from "material-table";
import {tableIcons} from "../../../../components/TableIcons/TableIcons";
import Edit from '@material-ui/icons/Edit';
import TestimonyForm from "./form/TestimonyForm";
import FormDialog from "../../../../components/FormDialog/FormDialog";
import Button from "@material-ui/core/Button";
import Toast from "../../../../components/Toast/Toast";


const GET_TESTIMONIES = gql`
    query GetTestimonies {
        testimonies {
            id,
            author,
            occupation,
            text,
            published
        }
    }
`;

const CREATE_TESTIMONY = gql`
    mutation CreateTestimony($input: TestimonyInputCreate!) {
        testimonyCreate(input: $input) {
            id,
            title
        }
    }
`;

const UPDATE_TESTIMONY = gql`
    mutation UpdateBlogArticle($id: String!, $input: TestimonyInputUpdate!) {
        testimonyUpdate(id: $id, input: $input) {
            id,
            title
        }
    }
`;

const TestimonyPage = () => {
    const { loading, error, data, refetch: refetchTestimonies } = useQuery(GET_TESTIMONIES);

    const [ toast, setToast ] = React.useState(null);

    const [createTestimony] = useMutation(CREATE_TESTIMONY, {
        onCompleted: (data) => {
            console.log('create mutation complete', data);

            setToast({
                type: 'success',
                text: `Item Created`
            });

            refetchTestimonies();

            setCreatingItem(false);
        },
        onError: (err) => {
            console.log('create mutation err', err);
            setToast({
                type: 'error',
                text: `Failed to Create Item`
            });
        }
    });
    const [updateTestimony] = useMutation(UPDATE_TESTIMONY, {
        onCompleted: (data) => {
            console.log('update mutation complete', data);

            setToast({
                type: 'success',
                text: 'Item Updated'
            });

            refetchTestimonies();

            setEditingItem(null);
        },
        onError: (err) => {
            console.log('update mutation err', err);
            setToast({
                type: 'error',
                text: `Failed to Update Item`
            });
        }
    });

    const [isCreatingItem, setCreatingItem] = React.useState(false);
    const [isEditingItem, setEditingItem] = React.useState(null);

    const handleEditRequest = (rowData) => {
        console.log('edit request', rowData);
        setEditingItem(
            data.testimonies.find(item => item.id === rowData.id)
        )
    };

    return (
        <div className="te-bo-page te-content-item-page">
            <Button variant="contained" color="primary" onClick={() => setCreatingItem(true)}>
                Create New
            </Button>

            <MaterialTable
                icons={tableIcons}
                title="Testimonies"
                columns={[
                    { title: "Author", field: "author" },
                    { title: "is Published?", field: "published" }

                ]}
                data={data && data.testimonies.map(item => (
                    {
                        id: item.id,
                        author: item.author,
                        published: item.published
                    }
                ))}
                actions={[
                    {
                        icon: Edit,
                        tooltip: 'Edit Item',
                        onClick: (event, rowData) => handleEditRequest(rowData)
                    },
                    // {
                    //     icon: DeleteOutline,
                    //     tooltip: 'Delete Item',
                    //     onClick: (event, rowData) => handleDeleteRequest(rowData)
                    // }
                ]}
                options={{
                    actionsColumnIndex: -1
                }}
            />
            <FormDialog
                title="Create FAQ"
                open={isCreatingItem}
                formComponent={
                    <TestimonyForm
                        actionLabel="Create"
                        onSubmit={(values) => {
                            console.log('submit create', values);
                            createTestimony({
                                variables: {
                                    input: values
                                }
                            })
                        }}
                        onCancel={() => setCreatingItem(false)}
                    />
                }
            />

            <FormDialog
                title={`Edit '${isEditingItem ? isEditingItem.author : ''}'`}
                open={!!isEditingItem}
                formComponent={
                    <TestimonyForm
                        actionLabel="Edit"
                        initialValues={isEditingItem}
                        onSubmit={(values) => {
                            console.log('submit edit', values);
                            updateTestimony({
                                variables: {
                                    id: isEditingItem.id,
                                    input: values
                                }
                            })
                        }}
                        onCancel={() => setEditingItem(null)}
                    />
                }
            />

            <Toast
                open={!!toast}
                text={toast && toast.text}
                type={toast && toast.type}
                onRequestClose={(event, reason) => {
                    if (event === 'clickaway') return;

                    setToast(null)
                }}
            />
        </div>
    )
};

export default TestimonyPage;
