import React, { useState, useEffect } from 'react';
import { Button, Input, Form, Table, Modal, message } from 'antd';
import moment from 'moment';
import { PlusCircleOutlined, CheckCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import '../App.css';



function TodoApp() {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState({ title: '', description: '' });
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [loading, setLoading] = useState(false);

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    const fetchTasks = async () => {
        try {
            const response = await fetch('http://localhost:8000/tasks', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            } else {
                message.error('No se pudieron cargar las tareas');
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            message.error('Hubo un error al obtener las tareas');
        }
    };

    const handleAddEditTask = async (values) => {
        setLoading(true);  
        const method = currentTask ? 'PUT' : 'POST';
        const url = currentTask ? `http://localhost:8000/tasks/${currentTask.id}` : 'http://localhost:8000/tasks';
    
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(values),
            });
    
            if (response.ok) {
                const data = await response.json();
                setTasks(prevTasks => {
                    if (currentTask) {
                        return prevTasks.map(t => (t.id === currentTask.id ? data : t));
                    } else {
                        return [...prevTasks, data];
                    }
                });
                message.success(currentTask ? 'Tarea actualizada' : 'Tarea creada');
                setIsAddModalVisible(false);
                setIsEditModalVisible(false);
                setCurrentTask(null);
                setTask({ title: '', description: '' });  // Limpiar el modal
            } else {
                throw new Error('Error al guardar la tarea');
            }
        } catch (error) {
            console.error('Error saving task:', error);
            message.error('Hubo un error al guardar la tarea');
        }
        setLoading(false);  
    };
    
    

    const deleteTask = async (taskId) => {
        Modal.confirm({
            title: '¿Estás seguro de eliminar esta tarea?',
            content: 'Una vez eliminada, no podrás recuperarla.',
            onOk: async () => {
                try {
                    const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': csrfToken,
                        },
                        credentials: 'include',
                    });
    
                    if (!response.ok) {
                        throw new Error(`Error: ${response.status}`);
                    }
    
                    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
                    message.success('Tarea eliminada con éxito');
                } catch (error) {
                    console.error('Error eliminando la tarea:', error);
                    message.error('Hubo un error al eliminar la tarea');
                }
            },
        });
    };
    

    const handleEditTask = (task) => {
        setCurrentTask(task);
        setTask({ title: task.title, description: task.description });
        setIsEditModalVisible(true);
    };

    const showAddTaskModal = () => {
        setCurrentTask(null);  // Limpiar cualquier tarea editada previamente
        setTask({ title: '', description: '' });  // Limpiar campos antes de agregar
        setIsAddModalVisible(true);
    };
    const handleCompleteTask = async (taskId) => {
        try {
            const response = await fetch(`http://localhost:8000/tasks/${taskId}/complete`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });
    
            if (response.ok) {
                setTasks(prevTasks =>
                    prevTasks.map(task => task.id === taskId ? { ...task, completed: true } : task)
                );
                message.success('Tarea marcada como completada');
            } else {
                message.error('Error al completar la tarea');
            }
        } catch (error) {
            console.error('Error completando la tarea:', error);
            message.error('Hubo un error al completar la tarea');
        }
    };
        
    useEffect(() => {
        fetchTasks();
    }, []);

    const columns = [
        {
            title: 'Título',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Descripción',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Completada',
            dataIndex: 'completed',
            key: 'completed',
            render: (text) => (
                <span style={{ color: text ? 'green' : 'red' }}>
                    {text ? 'Sí' : 'No'}
                </span>
            ),
        },
        {
            title: 'Fecha de Creación',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'Fecha de Actualización',
            dataIndex: 'updated_at',
            key: 'updated_at',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (text, record) => (
                <span>
                    <Button onClick={() => handleEditTask(record)} type="button">
                        Editar
                    </Button>
                    <Button onClick={() => deleteTask(record.id)} type="button" danger>
                        Eliminar
                    </Button>
                </span>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1>Lista de Tareas</h1>

            <Button
              type="primary"
              onClick={() => setIsAddModalVisible(true)}
              icon={<PlusCircleOutlined />}
              style={{ marginBottom: '20px' }}
            >           
             Agregar Tarea
            </Button>


            <Table
    columns={[
        {
            title: 'Título',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Descripción',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Completada',
            dataIndex: 'completed',
            key: 'completed',
            render: (text) => (
                <span style={{ color: text ? 'green' : 'red' }}>
                    {text ? 'Sí' : 'No'}
                </span>
            ),
        },
        {
            title: 'Fecha de Creación',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'Fecha de Actualización',
            dataIndex: 'updated_at',
            key: 'updated_at',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (text, record) => (
                <span>
                    {!record.completed && (
                        <CheckCircleOutlined className="icon-size"
                            onClick={() => handleCompleteTask(record.id)}
                            style={{ color: 'green', marginRight: 8, cursor: 'pointer' }}
                        />
                    )}
                    <EditOutlined className="icon-size"
                        onClick={() => handleEditTask(record)}
                        style={{ color: 'blue', marginRight: 8, cursor: 'pointer' }}
                    />
                    <DeleteOutlined className="icon-size"
                        onClick={() => deleteTask(record.id)}
                        style={{ color: 'red', cursor: 'pointer' }}
                    />
                </span>
            ),
        },
    ]}
    dataSource={tasks}
    rowKey="id"
    pagination={false}
    style={{ width: '60%' }} // Ajusta el ancho de la tabla
    scroll={{ x: 'max-content' }} 
/>


            {/* Modal de Agregar */}
            <Modal
                title="Agregar Tarea"
                visible={isAddModalVisible}
                onCancel={() => setIsAddModalVisible(false)}
                footer={null}
            >
                <Form
                    onFinish={handleAddEditTask}
                    initialValues={task}
                    layout="vertical"
                >
                    <Form.Item
                        name="title"
                        label="Título"
                        rules={[{ required: true, message: 'Por favor ingresa un título' }]}
                    >
                        <Input
                            value={task.title}
                            onChange={(e) => setTask({ ...task, title: e.target.value })}
                            placeholder="Título de la tarea"
                        />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Descripción"
                        rules={[{ required: true, message: 'Por favor ingresa una descripción' }]}
                    >
                        <Input.TextArea
                            value={task.description}
                            onChange={(e) => setTask({ ...task, description: e.target.value })}
                            placeholder="Descripción de la tarea"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Agregar
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal de Editar */}
            <Modal
                title="Editar Tarea"
                visible={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null}
            >
                <Form
                    onFinish={handleAddEditTask}
                    initialValues={task}
                    layout="vertical"
                >
                    <Form.Item
                        name="title"
                        label="Título"
                        rules={[{ required: true, message: 'Por favor ingresa un título' }]}
                    >
                        <Input
                            value={task.title}
                            onChange={(e) => setTask({ ...task, title: e.target.value })}
                            placeholder="Título de la tarea"
                        />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Descripción"
                        rules={[{ required: true, message: 'Por favor ingresa una descripción' }]}
                    >
                        <Input.TextArea
                            value={task.description}
                            onChange={(e) => setTask({ ...task, description: e.target.value })}
                            placeholder="Descripción de la tarea"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                          {currentTask ? 'Actualizar' : 'Agregar'}
                        </Button>
                    </Form.Item> 

                </Form>
            </Modal>
        </div>
    );
}

export default TodoApp;
