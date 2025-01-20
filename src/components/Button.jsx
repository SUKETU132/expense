import React from 'react';
import styled from 'styled-components';

const Button = ({ children, onClick, type = "button", disabled = false, className }) => {
  return (
    <StyledWrapper className={className}>
      <button className="button" onClick={onClick} type={type} disabled={disabled}>
        <span>{children}</span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;

  .button {
    position: relative;
    text-decoration: none;
    color: #fff;
    background: linear-gradient(45deg, #0ce39a, #69007f, #fc0987);
    padding: 8px 18px;
    border-radius: 10px;
    font-size: 1.25em;
    cursor: pointer;
    border: none;
    outline: none;
    transition: 0.3s ease;
  }

  .button span {
    position: relative;
    z-index: 1;
  }

  .button::before {
    content: "";
    position: absolute;
    inset: 1px;
    background: #272727;
    border-radius: 9px;
    transition: 0.5s;
  }

  .button:hover::before {
    opacity: 0.7;
  }

  .button::after {
    content: "";
    position: absolute;
    inset: 0px;
    background: linear-gradient(45deg, #0ce39a, #69007f, #fc0987);
    border-radius: 9px;
    transition: 0.5s;
    opacity: 0;
    filter: blur(20px);
  }

  .button:hover:after {
    opacity: 1;
  }

  .button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export default React.memo(Button);
