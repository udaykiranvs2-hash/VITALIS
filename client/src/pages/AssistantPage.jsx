import AiChatWidget from '../components/AiChatWidget.jsx';

function AssistantPage() {
  return (
    <div className="feature-page" style={{ height: 'calc(100vh - 80px)', padding: '0', display: 'flex', flexDirection: 'column' }}>
      <AiChatWidget isFullScreen={true} />
    </div>
  );
}

export default AssistantPage;
