// 커스텀 Web Components 타입 선언
// donote-widget 커스텀 엘리먼트를 위한 타입

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'donote-widget': React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement> & {
                    handle?: string;
                    'style-type'?: string;
                    theme?: string;
                    text?: string;
                },
                HTMLElement
            >;
        }
    }
}

export { };
