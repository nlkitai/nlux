export default `
event: data
data: {
    "content": "This is some test AI data",
    "additional_kwargs": {},
    "type": "AIMessageChunk",
    "example": false
}

event: update
data: {
    "content": "This is some test updates from AI",
    "additional_kwargs": {},
    "type": "AIMessageChunk",
    "example": false
}

event: data
data: {
    "content": "This is some extra test AI data",
    "additional_kwargs": {},
    "type": "AIMessageChunk",
    "example": false
}
`;
