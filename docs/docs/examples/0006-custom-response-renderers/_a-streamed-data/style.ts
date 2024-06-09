export default `.colourful-response-renderer {
    position: relative;
    width: 100%;
}

.feather-background {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 99;
    overflow: auto;
    border-radius: 5px;
    margin: auto;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    background: linear-gradient(315deg, rgba(101,0,94,1) 3%, rgba(60,132,206,1) 38%, rgba(48,238,226,1) 68%, rgba(255,25,25,1) 98%);
    animation: gradient 15s ease infinite;
    background-size: 400% 400%;
    background-attachment: fixed;
}

.response-container {
    position: inherit;
    z-index: 999;
    padding: 10px;
}

.rating-container {
    position: relative;
    z-index: 999;
    padding: 5px 10px;
    background: rgba(0, 0, 0, 0.6);
    color: #A0A0A0;
    font-size: 0.8em;
    text-align: right;
}

.rating-container button {
    background: #e0e0e055;
    border: none;
    border-radius: 10px;
    color: white;
    font-size: 0.8em;
    cursor: pointer;
    padding: 4px 6px;
    margin: 0 2px;
}

@keyframes gradient {
    0% {
        background-position: 0% 0%;
    }
    50% {
        background-position: 100% 100%;
    }
    100% {
        background-position: 0% 0%;
    }
}

.feather-background .wave {
    background: rgb(255 255 255 / 25%);
    border-radius: 1000% 1000% 0 0;
    position: fixed;
    height: 12em;
    animation: wave 5s -1.5s linear infinite;
    transform: translate3d(0, 0, 0);
    opacity: 0.8;
    bottom: 0;
    left: 0;
    z-index: -1;
}

.feather-background .wave:nth-of-type(2) {
    bottom: -1.25em;
    animation: wave 18s linear reverse infinite;
    opacity: 0.8;
}

.feather-background .wave:nth-of-type(3) {
    bottom: -2.5em;
    animation: wave 20s -1s reverse infinite;
    opacity: 0.9;
}

@keyframes wave {
    2% {
        transform: translateX(1);
    }

    25% {
        transform: translateX(-25%);
    }

    50% {
        transform: translateX(-50%);
    }

    75% {
        transform: translateX(-25%);
    }

    100% {
        transform: translateX(1);
    }
}
`;
