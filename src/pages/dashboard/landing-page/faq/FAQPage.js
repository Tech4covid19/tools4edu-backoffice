import React from 'react';
import gql from 'graphql-tag';
import {useMutation, useQuery} from '@apollo/react-hooks';
import MaterialTable from "material-table";
import {tableIcons} from "../../../../components/TableIcons/TableIcons";
import Edit from '@material-ui/icons/Edit';
import FAQForm from "./form/FAQForm";
import CreateEntityDialog from "../../../../components/CreateEntityDialog/CreateEntityDialog";
import Button from "@material-ui/core/Button";
import Toast from "../../../../components/Toast/Toast";


const GET_FAQS = gql`
    query GetFaqs {
        faqs {
            id,
            order,
            question,
            answer,
            published,
            stakeholder {
                id,
                title
            }
            provider {
                id,
                title
            }
        }
    }
`;

const CREATE_FAQ = gql`
    mutation CreateFaq($input: FaqInputCreate!) {
        faqCreate(input: $input) {
            id,
            title
        }
    }
`;

const UPDATE_FAQ = gql`
    mutation UpdateFaq($id: String!, $input: FaqInputUpdate!) {
        faqUpdate(id: $id, input: $input) {
            id,
            title
        }
    }
`;

const FAQPage = () => {
    const { loading, error, data, refetch: refetchContentItems } = useQuery(GET_FAQS);

    const [ toast, setToast ] = React.useState(null);

    const [createFaq] = useMutation(CREATE_FAQ, {
        onCompleted: (data) => {
            console.log('create mutation complete', data);

            setToast({
                type: 'success',
                text: `Item Created`
            });

            refetchContentItems();

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
    const [updateFaq] = useMutation(UPDATE_FAQ, {
        onCompleted: (data) => {
            console.log('update mutation complete', data);

            setToast({
                type: 'success',
                text: 'Item Updated'
            });

            refetchContentItems();

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
        setEditingItem(
            data.faqs.find(item => item.id === rowData.id)
        )
    };

    return (
        <div className="te-bo-page te-content-item-page">
            <Button variant="contained" color="primary" onClick={() => setCreatingItem(true)}>
                Create New
            </Button>

            <MaterialTable
                icons={tableIcons}
                title="FAQs"
                columns={[
                    { title: "Question", field: "question" },
                    { title: "Stakeholder", field: "stakeholder" },
                    { title: "Provider", field: "provider"}
                ]}
                data={data && data.faqs.map(item => (
                    {
                        id: item.id,
                        question: item.question,
                        stakeholder: item.stakeholder ? item.stakeholder.title : '',
                        provider: item.provider ? item.provider.title : ''
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
            <CreateEntityDialog
                title="Create FAQ"
                open={isCreatingItem}
                formComponent={
                    <FAQForm
                        actionLabel="Create"
                        onSubmit={(values) => {
                            console.log('submit create', values);
                            createFaq({
                                variables: {
                                    input: values
                                }
                            })
                        }}
                        onCancel={() => setCreatingItem(false)}
                    />
                }
            />

            <CreateEntityDialog
                title={`Edit '${isEditingItem ? isEditingItem.title : ''}'`}
                open={!!isEditingItem}
                formComponent={
                    <FAQForm
                        actionLabel="Edit"
                        initialValues={isEditingItem}
                        onSubmit={(values) => {
                            console.log('submit edit', values);
                            updateFaq({
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

export default FAQPage;
