import React, {useEffect} from 'react';
import './ContentItemPage.scss';
import gql from 'graphql-tag';
import {useMutation, useQuery} from '@apollo/react-hooks';
import MaterialTable from "material-table";
import {tableIcons} from "../../../../components/TableIcons/TableIcons";
import Edit from '@material-ui/icons/Edit';
import ContentItemForm from "./form/ContentItemForm";
import CreateEntityDialog from "../../../../components/CreateEntityDialog/CreateEntityDialog";
import Button from "@material-ui/core/Button";
import {useDashboardState} from "../../DashboardState";
import Toast from "../../../../components/Toast/Toast";


const GET_CONTENT_ITEMS = gql`
    query GetContentItems {
        contentItems {
            id,
            order,
            videoUrl,
            videoTime,
            imageUrl,
            title,
            text,
            createdAt,
            updatedAt,
            slug,
            published,
            stakeholders {
                id,
                title
            }
            providers {
                id,
                title
            }
            tags {
                id,
                title
            }    
        }
    }
`;

const CREATE_CONTENT_ITEM = gql`
    mutation CreateContentItem($input: ContentItemInputCreate!) {
        contentItemCreate(input: $input) {
            id,
            title
        }
    }
`;

const UPDATE_CONTENT_ITEM = gql`
    mutation UpdateContentItem($id: String!, $input: ContentItemInputUpdate!) {
        contentItemUpdate(id: $id, input: $input) {
            id,
            title
        }
    }
`;

const ContentItemPage = () => {
    const { loading, error, data, refetch: refetchContentItems } = useQuery(GET_CONTENT_ITEMS);

    const [ toast, setToast ] = React.useState(null);

    const [createContentItem] = useMutation(CREATE_CONTENT_ITEM, {
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
    const [updateContentItem] = useMutation(UPDATE_CONTENT_ITEM, {
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
            data.contentItems.find(item => item.id === rowData.id)
        )
    };

    return (
        <div className="te-bo-page te-content-item-page">
            <Button variant="contained" color="primary" onClick={() => setCreatingItem(true)}>
                Create New
            </Button>

            <MaterialTable
              icons={tableIcons}
              title="Content Items"
              columns={[
                  { title: "Title", field: "title" },
                  { title: "Slug", field: "slug" },
              ]}
              data={data && data.contentItems.map(item => (
                  { id: item.id, title: item.title, slug: item.slug }
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
                title="Create Content Item"
                open={isCreatingItem}
                formComponent={
                    <ContentItemForm
                        actionLabel="Create"
                        onSubmit={(values) => {
                            console.log('submit create', values);
                            createContentItem({
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
                    <ContentItemForm
                        actionLabel="Edit"
                        initialValues={isEditingItem}
                        onSubmit={(values) => {
                            console.log('submit edit', values);
                            updateContentItem({
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

export default ContentItemPage;
