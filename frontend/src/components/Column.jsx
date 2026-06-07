import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

function Column({ title, tasks }) {
  // useDroppable 훅을 사용하여 이 영역을 드롭 가능한 구역으로 지정합니다.
  const { setNodeRef, isOver } = useDroppable({
    id: title, // 'TODO', 'IN_PROGRESS', 'DONE' 이 id가 됩니다.
  });

  return (
    <div 
      ref={setNodeRef} 
      style={{ 
        width: '300px', 
        background: isOver ? '#e2e6ea' : '#f4f5f7', // 카드가 위로 올라오면 배경색을 살짝 어둡게 변경
        padding: '15px', 
        borderRadius: '8px', 
        minHeight: '400px',
        transition: 'background-color 0.2s ease'
      }}
    >
      <h3 style={{ textAlign: 'center', marginBottom: '15px', color: '#333' }}>{title}</h3>
      
      {/* 이 컬럼에 속한 카드들만 렌더링합니다 */}
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

export default Column;