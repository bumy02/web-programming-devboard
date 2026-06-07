import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

function TaskCard({ task }) {
  // dnd-kit의 useDraggable 훅을 사용하여 이 요소를 드래그 가능하게 만듭니다.
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id.toString(), // id는 반드시 문자열이어야 합니다.
    data: task, // 드래그 중인 카드의 원래 정보를 담아둡니다.
  });

  // 드래그할 때 마우스 커서를 따라 카드가 움직이도록 하는 CSS 속성
  const style = {
    transform: CSS.Translate.toString(transform),
    padding: '15px',
    margin: '10px 0',
    backgroundColor: 'white',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    cursor: 'grab', // 마우스 포인터를 손바닥 모양으로 변경
    borderLeft: '4px solid #007bff'
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {task.title}
    </div>
  );
}

export default TaskCard;