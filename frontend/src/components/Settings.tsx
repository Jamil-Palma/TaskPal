import React from "react";

interface SettingsProps {
  onSave: (settings: { apiKey: string; language: string }) => void;
}

const Settings: React.FC<SettingsProps> = ({ onSave }) => {
  const [apiKey, setApiKey] = React.useState("");
  const [language, setLanguage] = React.useState("");

  const handleSave = () => {
    onSave({ apiKey, language });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />
      <input
        type="text"
        placeholder="Language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default Settings;
