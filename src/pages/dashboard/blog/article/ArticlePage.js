import React from 'react';
import gql from 'graphql-tag';
import {useMutation, useQuery} from '@apollo/react-hooks';
import MaterialTable from "material-table";
import {tableIcons} from "../../../../components/TableIcons/TableIcons";
import Edit from '@material-ui/icons/Edit';
import ArticleForm from "./form/ArticleForm";
import FormDialog from "../../../../components/FormDialog/FormDialog";
import Button from "@material-ui/core/Button";
import Toast from "../../../../components/Toast/Toast";


const GET_BLOG_ARTICLES = gql`
    query GetBlogArticles {
        blogArticles {
            id,
            title,
            summary,
            author,
            images,
            text,
            slug,
            published,
            createdAt,
            videoUrl
        }
    }
`;

const CREATE_BLOG_ARTICLE = gql`
    mutation CreateBlogArticle($input: BlogArticleInputCreate!) {
        blogArticleCreate(input: $input) {
            id,
            title
        }
    }
`;

const UPDATE_BLOG_ARTICLE = gql`
    mutation UpdateBlogArticle($id: String!, $input: BlogArticleInputUpdate!) {
        blogArticleUpdate(id: $id, input: $input) {
            id,
            title
        }
    }
`;

const ArticlePage = () => {
    const { loading, error, data, refetch: refetchBlogArticles } = useQuery(GET_BLOG_ARTICLES);

    const [ toast, setToast ] = React.useState(null);

    const [createBlogArticle] = useMutation(CREATE_BLOG_ARTICLE, {
        onCompleted: (data) => {
            console.log('create mutation complete', data);

            setToast({
                type: 'success',
                text: `Item Created`
            });

            refetchBlogArticles();

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
    const [updateBlogArticle] = useMutation(UPDATE_BLOG_ARTICLE, {
        onCompleted: (data) => {
            console.log('update mutation complete', data);

            setToast({
                type: 'success',
                text: 'Item Updated'
            });

            refetchBlogArticles();

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
            data.blogArticles.find(item => item.id === rowData.id)
        )
    };

    return (
        <div className="te-bo-page te-content-item-page">
            <Button variant="contained" color="primary" onClick={() => setCreatingItem(true)}>
                Create New
            </Button>

            <MaterialTable
                icons={tableIcons}
                title="Blog Articles"
                columns={[
                    { title: "Title", field: "title" },
                    { title: "Author", field: "author" },
                    { title: "is Published?", field: "published" },
                    { title: "Created At", field: "createdAt"},

                ]}
                data={data && data.blogArticles.map(item => (
                    {
                        id: item.id,
                        title: item.title,
                        author: item.author,
                        published: item.published,
                        createdAt: item.createdAt
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
                title="Create Blog Article"
                open={isCreatingItem}
                onRequestCancel={() => setCreatingItem(false)}
                formComponent={
                    <ArticleForm
                        actionLabel="Create"
                        onSubmit={(values) => {
                            console.log('submit create', values);
                            createBlogArticle({
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
                title={`Edit '${isEditingItem ? isEditingItem.title : ''}'`}
                open={!!isEditingItem}
                onRequestCancel={() => setEditingItem(null)}
                formComponent={
                    <ArticleForm
                        actionLabel="Edit"
                        initialValues={isEditingItem}
                        onSubmit={(values) => {
                            console.log('submit edit', values);
                            updateBlogArticle({
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

export default ArticlePage;
