const ProfileHeader = ({ user }) => {
  const placeholderImageUrl = 'https://picsum.photos/400';

  return (
    <div className="profile-header">
      <div className="profile-image-container">
        <img
          className="profile-image"
          src={user.image_url || placeholderImageUrl}
          alt={`${user.name}'s profile`}
        />
      </div>
      <div className="profile-details">
        <h2 className="profile-username">{user.name}</h2>
        <p className="profile-level">Level {user.skill_level}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
