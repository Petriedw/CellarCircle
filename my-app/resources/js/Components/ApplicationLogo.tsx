import { ImgHTMLAttributes } from 'react';

export default function ApplicationLogo(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img {...props} src="/images/cellar-circle-logo.png" alt="Cellar Circle Journal" />
    );
}
