import React from 'react';

const AppLayout = ({children, props}) => {
        return (
            <div>
                <div className="page-wrapper">
                    <div className="child-wrapper">
                        {children}
                    </div>
                </div>
            </div>
        );
}

export default AppLayout;