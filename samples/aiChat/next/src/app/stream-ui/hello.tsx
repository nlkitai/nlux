'use server';

export default async function HelloServerComponent() {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return (
        <div>
            <h1>Hello React Server Component!</h1>
        </div>
    );
};
