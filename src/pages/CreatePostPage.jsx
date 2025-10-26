import { useNavigate } from 'react-router-dom';
import CreatePostForm from '~components/Posts/CreatePostForm.jsx';

function CreatePostPage() {
    const navigate = useNavigate();

    const handleCancel = () => {
        navigate('/posts');
    };

    return (
        <section className="content-section">
            <CreatePostForm onCancel={handleCancel} />
        </section>
    );
}

export default CreatePostPage;