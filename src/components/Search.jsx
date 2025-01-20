import React, { forwardRef } from 'react';
import styled from 'styled-components';

const Input = forwardRef(({ value, onChange, placeholder = "Enter name", className }, ref) => {
  return (
    <StyledWrapper className={className}>
      <label className="label">
        <span className="icon">
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={30} height={30} fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeWidth="1.25" d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </span>
        <input
          ref={ref}
          type="text"
          className="input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete="off"
        />
      </label>
    </StyledWrapper>
  );
});

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;

  .label {
    position: relative;
    display: flex;
    align-items: center;
    width: 300px;
    border-radius: 6px;
    border: 2px solid #373737;
    padding: 10px;
    background-color: transparent;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
  }

  .input {
    flex: 1;
    background-color: transparent;
    outline: none;
    border: none;
    color: #c5c5c5;
    font-size: 16px;
  }
`;

export default React.memo(Input);
