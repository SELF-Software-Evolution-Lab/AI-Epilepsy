import React, { useState } from "react";

const Folder = ({ explorer }) => {
  const [expand, setexpand] = useState(false);
  const [showInput, setShowInput] = useState({
    visible: false,
    isFolder: false,
  });

  const [selectedExam, setselectedExam] = useState(null);
  const handleExamSelection = (event) => {
    setselectedExam(event.target.value);
    console.log(event.target.value);
  };

  if (explorer.isFolder) {
    return (
      <div>
        <div className="folder" onClick={() => setexpand(!expand)}>
          <span>
            📁
            {explorer.name}
          </span>
        </div>
        <div style={{ display: expand ? "block" : "none", paddingLeft: 25 }}>
          {showInput.visible && (
            <div className="inputContainer">
              <span>{showInput.isFolder ? "📁" : "📄"}</span>
              <input
                type="text"
                className="inputContainer__input"
                autoFocus
                onBlur={() => setShowInput({ ...showInput, visible: false })}
              />
            </div>
          )}

          {explorer.items.map((exp) => {
            return <Folder key={exp.id} explorer={exp} />;
          })}
        </div>
      </div>
    );
  } else {
    return (
      <div className="file">
        <label>
          <input
            type="radio"
            name="exam"
            onChange={handleExamSelection}
            value={explorer.id}
          />
          <span>📄 {explorer.name}</span>
        </label>
      </div>
    );
  }
};

export default Folder;
