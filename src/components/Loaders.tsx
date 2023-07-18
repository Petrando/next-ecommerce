import { FunctionComponent } from "react";

export const ThreeDots:FunctionComponent = () => {
    return (        
        <svg width="120" height="30" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="#fff">
            {/*<!-- By Sam Herbert (@sherb), for everyone. More @ http://goo.gl/7AJzbL -->*/}
            <circle cx="15" cy="15" r="15">
                <animate attributeName="r" from="15" to="15"
                        begin="0s" dur="0.8s"
                        values="15;9;15" calcMode="linear"
                        repeatCount="indefinite" />
                <animate attributeName="fillOpacity" from="1" to="1"
                        begin="0s" dur="0.8s"
                        values="1;.5;1" calcMode="linear"
                        repeatCount="indefinite" />
            </circle>
            <circle cx="60" cy="15" r="9" fillOpacity="0.3">
                <animate attributeName="r" from="9" to="9"
                        begin="0s" dur="0.8s"
                        values="9;15;9" calcMode="linear"
                        repeatCount="indefinite" />
                <animate attributeName="fillOpacity" from="0.5" to="0.5"
                        begin="0s" dur="0.8s"
                        values=".5;1;.5" calcMode="linear"
                        repeatCount="indefinite" />
            </circle>
            <circle cx="105" cy="15" r="15">
                <animate attributeName="r" from="15" to="15"
                        begin="0s" dur="0.8s"
                        values="15;9;15" calcMode="linear"
                        repeatCount="indefinite" />
                <animate attributeName="fillOpacity" from="1" to="1"
                        begin="0s" dur="0.8s"
                        values="1;.5;1" calcMode="linear"
                        repeatCount="indefinite" />
            </circle>
        </svg>
    );
}

export const BallTriangle:FunctionComponent = () => {
    return (
        <svg width="57" height="57" viewBox="0 0 57 57" xmlns="http://www.w3.org/2000/svg" stroke="#047857">
            <g fill="none" fillRule="evenodd">
                <g transform="translate(1 1)" strokeWidth="2">
                    <circle cx="5" cy="50" r="5">
                        <animate attributeName="cy"
                            begin="0s" dur="2.2s"
                            values="50;5;50;50"
                            calcMode="linear"
                            repeatCount="indefinite" />
                        <animate attributeName="cx"
                            begin="0s" dur="2.2s"
                            values="5;27;49;5"
                            calcMode="linear"
                            repeatCount="indefinite" />
                    </circle>
                    <circle cx="27" cy="5" r="5">
                        <animate attributeName="cy"
                            begin="0s" dur="2.2s"
                            from="5" to="5"
                            values="5;50;50;5"
                            calcMode="linear"
                            repeatCount="indefinite" />
                        <animate attributeName="cx"
                            begin="0s" dur="2.2s"
                            from="27" to="27"
                            values="27;49;5;27"
                            calcMode="linear"
                            repeatCount="indefinite" />
                    </circle>
                    <circle cx="49" cy="50" r="5">
                        <animate attributeName="cy"
                            begin="0s" dur="2.2s"
                            values="50;50;5;50"
                            calcMode="linear"
                            repeatCount="indefinite" />
                        <animate attributeName="cx"
                            from="49" to="49"
                            begin="0s" dur="2.2s"
                            values="49;5;27;49"
                            calcMode="linear"
                            repeatCount="indefinite" />
                    </circle>
                </g>
            </g>
        </svg>
    );
}

export const TailSpin:FunctionComponent = () => {
    return (
        <svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
                    <stop stopColor="#000" stopOpacity="0" offset="0%"/>
                    <stop stopColor="#000" stopOpacity=".631" offset="63.146%"/>
                    <stop stopColor="#000" offset="100%"/>
                </linearGradient>
            </defs>
            <g fill="none" fillRule="evenodd">
                <g transform="translate(1 1)">
                    <path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" strokeWidth="2">
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 18 18"
                            to="360 18 18"
                            dur="0.9s"
                            repeatCount="indefinite" />
                    </path>
                    <circle fill="#000" cx="36" cy="18" r="1">
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 18 18"
                            to="360 18 18"
                            dur="0.9s"
                            repeatCount="indefinite" />
                    </circle>
                </g>
            </g>
        </svg>
    );
}

type ILoaderContainer =  {
    dimension?:string
}
export const LoaderContainer:FunctionComponent<ILoaderContainer> = ({ dimension }) => {
    return (
        <div className={`flex items-center ${dimension?dimension:"w-8 h-8"}`}>
            <BallTriangle />
        </div>
    );
}

export const SingleRowLoader = () => {
    return (
        <div className="w-full flex items-center justify-center py-1">
            <LoaderContainer />            
        </div>
    );
}