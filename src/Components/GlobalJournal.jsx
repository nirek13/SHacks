import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Journal = () => {
    const [tweet, setTweet] = useState('');
    const [tweets, setTweets] = useState([]);

    useEffect(() => {
        const fetchTweets = async () => {
            try {
                const response = await axios.get('http://localhost:1000/api/feed');
                setTweets(response.data);
            } catch (error) {
                console.error('Error fetching tweets:', error);
            }
        };

        fetchTweets();
    }, []);

    const handleTweetChange = (e) => {
        setTweet(e.target.value);
    };

    const handleTweetSubmit = async (e) => {
        e.preventDefault();
        if (tweet.trim()) {
            try {
                const username = localStorage.getItem("username");

                const response = await axios.post('http://localhost:1000/api/createPost', {
                    username: username,
                    message: tweet,
                });

                setTweets([response.data, ...tweets]);
                setTweet('');
            } catch (error) {
                console.error('Error posting tweet:', error);
            }
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
                <TweetList tweets={tweets} setTweets={setTweets} />
            </div>
   

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

const TweetList = ({ tweets, setTweets }) => (
    <div style={styles.tweetListContainer}>
        {tweets.map((tweet, index) => (
            <Tweet key={index} tweet={tweet} setTweets={setTweets} tweets={tweets} />
        ))}
    </div>
);

const Tweet = ({ tweet, setTweets, tweets }) => {
    const [showReply, setShowReply] = useState(false);
    const [reply, setReply] = useState('');

    const toggleReply = () => {
        setShowReply(!showReply);
    };

    const handleReplyChange = (e) => {
        setReply(e.target.value);
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (reply.trim()) {
            try {
                const username = localStorage.getItem("username");

                const response = await axios.post('http://localhost:1000/api/createReply', {
                    username: username,
                    message: reply,
                    chatTableName: tweet.table_name,
                    postId: tweet.post
                });

                console.log('Reply posted successfully:', response.data);
                const updatedTweets = tweets.map(t => {
                    if (t.post === tweet.post) {
                        return {
                            ...t,
                            replies: [...(t.replies || []), response.data]
                        };
                    }
                    return t;
                });
                setTweets(updatedTweets);
                setReply('');
            } catch (error) {
                console.error('Error posting reply:', error.response ? error.response.data : error.message);
            }
        }
    };

    return (
        <div style={styles.tweetContainer}>
            <p><strong>{tweet.username}</strong>: {tweet.message}</p>
            <button onClick={toggleReply} style={styles.replyButton}>
                Reply
            </button>
            {showReply && (
                <Reply
                    reply={reply}
                    onReplyChange={handleReplyChange}
                    onReplySubmit={handleReplySubmit}
                />
            )}
            <ReplyList replies={tweet.replies} />
        </div>
    );
};

const Reply = ({ reply, onReplyChange, onReplySubmit }) => (
    <div style={styles.replyContainer}>
        <form onSubmit={onReplySubmit}>
            <input
                type="text"
                value={reply}
                onChange={onReplyChange}
                placeholder="Write a reply..."
                style={styles.input}
            />
            <button type="submit" style={styles.button}>Reply</button>
        </form>
    </div>
);

const ReplyList = ({ replies }) => (
    <div style={styles.replyListContainer}>
        {replies && replies.map((reply, index) => (
            <div key={index} style={styles.replyItem}>
                <p><strong>{reply.username}</strong>: {reply.message}</p>
            </div>
        ))}
    </div>
);



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
        backgroundColor: '#f5f5f5',
        color: '#333',
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
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
        borderRadius: '12px',
        padding: '15px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '20px',
        border: '1px solid #e0e0e0',
    },
    textarea: {
        width: '100%',
        border: '1px solid #e0e0e0',
        outline: 'none',
        padding: '12px',
        borderRadius: '8px',
        boxSizing: 'border-box',
        fontSize: '16px',
        resize: 'none',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
    },
    button: {
        marginTop: '10px',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: '#4CAF50',
        color: '#ffffff',
        cursor: 'pointer',
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
    },
    tweetListContainer: {
        width: '100%',
    },
    tweetContainer: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '15px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '15px',
        border: '1px solid #e0e0e0',
    },
    replyButton: {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#4CAF50',
        cursor: 'pointer',
        padding: '5px',
        textDecoration: 'underline',
        fontSize: '14px',
        marginTop: '5px',
        fontFamily: 'Arial, sans-serif',
    },
    replyContainer: {
        marginTop: '10px',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
    },
    replyListContainer: {
        marginTop: '10px',
    },
    replyItem: {
        marginTop: '10px',
        backgroundColor: '#f9f9f9',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        width: '100%',
        border: '1px solid #e0e0e0',
    },
    input: {
        flex: 1,
        border: '1px solid #e0e0e0',
        outline: 'none',
        padding: '10px',
        borderRadius: '8px',
        boxSizing: 'border-box',
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
        marginBottom: '10px',
    },
    
    searchBarContainer: {
        width: '100%',
        padding: '10px 20px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        borderTop: '1px solid #e0e0e0',
        marginTop: '20px',
    },
};

export default Journal;
