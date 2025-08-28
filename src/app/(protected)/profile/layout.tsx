import type { Metadata } from "next";


export const metadata: Metadata = {
    title: 'Profile - Creators'
}

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {children}
        </>
    );
}
