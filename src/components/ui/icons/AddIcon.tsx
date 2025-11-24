export const AddIcon: React.FC<React.SVGAttributes<{}>> = (props) => (
    <svg 
        width="15" 
        height="16" 
        viewBox="0 0 15 16" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        {...props}
    >
        <g clipPath="url(#clip0_266_17484)">
            <path 
                d="M15 7.375H8.125V0.5H6.875V7.375H0V8.625H6.875V15.5H8.125V8.625H15V7.375Z" 
                fill="currentColor" // Using "currentColor" for flexibility
            />
        </g>
        <defs>
            <clipPath id="clip0_266_17484">
                <rect 
                    width="15" 
                    height="15" 
                    fill="white" 
                    transform="translate(0 0.5)" 
                />
            </clipPath>
        </defs>
    </svg>
);
