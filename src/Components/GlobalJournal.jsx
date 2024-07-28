import React, { useState } from 'react';

const Journal = () => {
    const [tweet, setTweet] = useState('');
    const [tweets, setTweets] = useState([
        { id: 1, content: 'Hello World!' },
        { id: 2, content: 'This is my second tweet!' },
    ]);

    const handleTweetChange = (e) => {
        setTweet(e.target.value);
    };

    const handleTweetSubmit = (e) => {
        e.preventDefault();
        if (tweet.trim()) {
            setTweets([{ id: Date.now(), content: tweet }, ...tweets]);
            setTweet('');
        }
    };

    return (
        <div style={styles.appContainer}>

            <div style={styles.mainContent}>
                <TweetInput
                    tweet={tweet}
                    onTweetChange={handleTweetChange}
                    onTweetSubmit={handleTweetSubmit}
                />
                <TweetList tweets={tweets} />
            </div>
            <FriendsWidget />
            <SearchBar />
        </div>
    );
};



const TweetInput = ({ tweet, onTweetChange, onTweetSubmit }) => (
    <div style={styles.tweetInputContainer}>
        <form onSubmit={onTweetSubmit}>
      <textarea
          value={tweet}
          onChange={onTweetChange}
          placeholder="What's happening?"
          style={styles.textarea}
      />
            <button type="submit" style={styles.button}>Tweet</button>
        </form>
    </div>
);

const TweetList = ({ tweets }) => (
    <div style={styles.tweetListContainer}>
        {tweets.map((tweet) => (
            <Tweet key={tweet.id} content={tweet.content} />
        ))}
    </div>
);

const Tweet = ({ content }) => {
    const [showReply, setShowReply] = useState(false);

    const toggleReply = () => {
        setShowReply(!showReply);
    };

    return (
        <div style={styles.tweetContainer}>
            <p>{content}</p>
            <button onClick={toggleReply} style={styles.replyButton}>
                Reply
            </button>
            {showReply && <Reply />}
        </div>
    );
};

const Reply = () => (
    <div style={styles.replyContainer}>
        <input
            type="text"
            placeholder="Write a reply..."
            style={styles.input}
        />
        <button style={styles.button}>Reply</button>
    </div>
);

const FriendsWidget = () => {
    const friends = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
    ];

    return (
        <div style={styles.friendsWidgetContainer}>
            <h2>Friends</h2>
            <ul style={styles.friendsList}>
                {friends.map((friend) => (
                    <li key={friend.id} style={styles.friendItem}>
                        {friend.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const SearchBar = () => (
    <div style={styles.searchBarContainer}>
        <input
            type="text"
            placeholder="Search..."
            style={styles.input}
        />
    </div>
);

const styles = {
    appContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100vh',
        backgroundColor: '#f0f8ff', // light blue theme
        color: '#333',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        width: '100%',
        padding: '10px 20px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #ddd',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    mainContent: {
        flex: 1,
        width: '100%',
        maxWidth: '600px',
        padding: '20px',
        boxSizing: 'border-box',
    },
    tweetInputContainer: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        padding: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px',
    },
    textarea: {
        width: '100%',
        border: 'none',
        outline: 'none',
        padding: '10px',
        borderRadius: '10px',
        boxSizing: 'border-box',
        fontSize: '16px',
        resize: 'none',
    },
    button: {
        marginTop: '10px',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '10px',
        backgroundColor: '#1da1f2',
        color: '#ffffff',
        cursor: 'pointer',
    },
    tweetListContainer: {
        width: '100%',
    },
    tweetContainer: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        padding: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '10px',
    },
    replyButton: {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#1da1f2',
        cursor: 'pointer',
        padding: '5px',
        textDecoration: 'underline',
        fontSize: '14px',
    },
    replyContainer: {
        marginTop: '10px',
        display: 'flex',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        border: 'none',
        outline: 'none',
        padding: '10px',
        borderRadius: '10px',
        boxSizing: 'border-box',
        fontSize: '16px',
    },
    friendsWidgetContainer: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        padding: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginTop: '20px',
    },
    friendsList: {
        listStyle: 'none',
        padding: 0,
    },
    friendItem: {
        padding: '5px 0',
        borderBottom: '1px solid #ddd',
    },
    searchBarContainer: {
        width: '100%',
        padding: '10px 20px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #ddd',
        boxShadow: '0 -2px 4px rgba(0,0,0,0.1)',
    },
};

export default Journal;
