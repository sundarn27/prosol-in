import React from 'react';
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div style={{ padding: '50px', textAlign: 'center', background:'#f0f2f5' }}>
      <Result
        status="error" 
        title="Oops! Something went wrong"
        subTitle="Sorry, we couldn't find the page you're looking for."
        extra={
          <Button type="primary" size="large">
            <Link to="/Home">Back to Home</Link>
          </Button>
        }
      />
    </div>
  );
};

export default ErrorPage;
