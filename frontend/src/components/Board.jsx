import { useState, useEffect } from 'react';
import axios from 'axios';
import { DndContext, closestCenter } from '@dnd-kit/core';
import Column from './Column';

const COLUMNS = ['TODO', 'IN_PROGRESS', 'DONE'];

function Board() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/api/tasks', getAuthHeaders());
      setTasks(res.data);
    } catch (error) {
      console.error('Task 불러오기 실패:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      await axios.post('/api/tasks', { title: newTaskTitle, status: 'TODO' }, getAuthHeaders());
      setNewTaskTitle('');
      fetchTasks();
    } catch (error) {
      console.error('Task 추가 실패:', error);
    }
  };

  // ⭐️ 드래그 앤 드롭이 끝났을 때 실행되는 함수
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    // 카드를 컬럼 밖(허공)에 떨어뜨렸으면 무시
    if (!over) return;

    const taskId = active.id;          // 드래그한 카드의 ID
    const newStatus = over.id;         // 드롭한 컬럼의 이름 (TODO, IN_PROGRESS, DONE)
    const taskData = active.data.current; // 카드의 원래 데이터

    // 원래 있던 컬럼과 같은 곳에 떨어뜨렸으면 무시
    if (taskData.status === newStatus) return;

    // 1. 화면(UI)부터 즉시 업데이트하여 반응성을 높임 (Optimistic UI)
    setTasks((prevTasks) => 
      prevTasks.map((t) => 
        t.id.toString() === taskId ? { ...t, status: newStatus } : t
      )
    );

    // 2. 백엔드 DB에 상태 변경 내용 저장
    try {
      await axios.put(`/api/tasks/${taskId}`, { status: newStatus, position: 0 }, getAuthHeaders());
    } catch (error) {
      console.error('상태 업데이트 실패:', error);
      fetchTasks(); // DB 저장에 실패하면 원래 상태로 되돌림(새로고침)
    }
  };

  return (
    <div>
      <form onSubmit={handleAddTask} style={{ marginBottom: '30px', textAlign: 'center' }}>
        <input
          type="text"
          placeholder="새로운 할 일 입력..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          style={{ padding: '10px', width: '300px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          추가
        </button>
      </form>

      {/* DndContext로 감싸서 드래그 앤 드롭 구역을 활성화합니다. */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'flex-start' }}>
          {COLUMNS.map((col) => (
            <Column 
              key={col} 
              title={col} 
              tasks={tasks.filter((t) => t.status === col)} 
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}

export default Board;