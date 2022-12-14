import React from 'react';
import styles from './index.less';

const Welcome: React.FC = () => {
    return (
        <div className={styles.container}>
            <div
                style={{
                    backgroundPosition: '100% -30%',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '274px auto',
                    backgroundImage:
                        "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
                }}
            >
                <div
                    style={{
                        fontSize: '20px',
                        color: '#1A1A1A',
                    }}
                >
                    欢迎使用 可话
                </div>
                <p
                    style={{
                        fontSize: '14px',
                        color: 'rgba(0,0,0,0.65)',
                        lineHeight: '22px',
                        marginTop: 16,
                        marginBottom: 32,
                        width: '65%',
                    }}
                >
                    在可话，记录你真实的想法和感受。<br />
                    <br />
                    「有共鸣」<br />
                    可话关心你想说的话。<br />
                    你的每一次记录，都会得到几条充满可能性的「共鸣」～<br />
                    <br />
                    「好朋友」<br />
                    你说的话会直达懂你的人。<br />
                    无论你有什么样的想法，这个世界上总会有人理解，ta 可能是一位聊得来的好朋友～<br />
                    <br />
                    「做自己」<br />
                    可话让你专注于做自己。<br />
                    在这里，只有和你互相理解的人才能看见你说的话。你和 ta 的互动也仅你们可见。<br />
                    <br />
                    「内测用户评价」<br />
                    <br />
                    “不用给自己贴标签，立人设。可以做回那个复杂、矛盾，但是真实的自己”<br />
                    <br />
                    “只能看见自己和别人之间的互动挺好的，不会被无关信息打扰，可以专注于表达”<br />
                    <br />
                    “之前没想过自己可以说这么多话，哈哈哈”<br />
                    <br />
                    「反馈联系」<br />
                    <br />
                    使用中有任何不爽，欢迎爆锤：<br />
                    <br />
                    微博：@可话<br />
                    邮箱：kehua@tideswing.fun


                </p>
            </div>
        </div>
    );
};

export default Welcome;
