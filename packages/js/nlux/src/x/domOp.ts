export const domOp = (op: Function) => {
    const id = requestAnimationFrame(() => {
        op();
    });

    return () => {
        cancelAnimationFrame(id);
    };
};
