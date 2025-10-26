import { useNavigate } from 'react-router-dom';
import { getAvatarUrl } from '~/utils/urlHelpers';
import { formatRelativeDate } from '~/utils/dateHelpers';
import '~/styles/PostCard.css';

function PostCard({ post }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/syntaxly/post/${post.id}`);
  };

  return (
    <div className="post-card" onClick={handleClick}>
      <div className="post-card-stats">
        <div className="stat-item">
          <div className="stat-value">{post.rating || 0}</div>
          <div className="stat-label">rating</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{post.comments_count || 0}</div>
          <div className="stat-label">answers</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{post.views || 0}</div>
          <div className="stat-label">views</div>
        </div>
      </div>

      <div className="post-card-content">
        <h3 className="post-title">{post.title}</h3>
        <p className="post-excerpt">{post.content}</p>

        <div className="post-card-footer">
          <div className="post-tags">
            {post.categories && post.categories.length > 0 && (
              post.categories.map((cat) => (
                <span key={cat.id} className="tag">
                  {cat.title}
                </span>
              ))
            )}
          </div>

          <div className="post-meta">
            <div className="post-author">
              <img
                src={getAvatarUrl(post.author_avatar)}
                alt={post.author_name}
                className="author-avatar"
              />
              <span className="author-name">{post.author_name}</span>
            </div>
            <span className="post-time">{formatRelativeDate(post.publish_date)}</span>
          </div>
        </div>
      </div>

      {(post.ban_status === 1 || post.ban_status === true) && (
        <div className="banned-overlay">
          <span className="banned-text">BANNED</span>
        </div>
      )}
    </div>
  );
}

export default PostCard;