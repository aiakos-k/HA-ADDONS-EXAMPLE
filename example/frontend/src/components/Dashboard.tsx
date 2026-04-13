/**
 * Dashboard Component
 */

import { useEffect } from 'react'
import { Alert, Button, Card, Col, Empty, Row, Space, Tag, Typography } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useHAStore } from '@/store/ha'
import haClient from '@/api/client'

const { Text, Title } = Typography

export function Dashboard() {
  const { sendMessage } = useWebSocket()
  const status = useHAStore((state) => state.status)
  const entities = useHAStore((state) => state.entities)
  const error = useHAStore((state) => state.error)
  const setStatus = useHAStore((state) => state.setStatus)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await haClient.getStatus()
        setStatus(data.status)
      } catch (err) {
        setStatus('error')
      }
    }

    fetchStatus()
  }, [setStatus])

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {error && (
        <Alert message={error} type="error" showIcon closable />
      )}

      <Card>
        <Title level={5} style={{ margin: 0, marginBottom: 8 }}>Status</Title>
        <Tag color={status === 'error' ? 'red' : status === 'loading' ? 'processing' : 'green'}>
          {status}
        </Tag>
      </Card>

      <Card
        title={`Entities (${entities.length})`}
        extra={
          <Button
            icon={<ReloadOutlined />}
            onClick={() => sendMessage({ action: 'get_entities' })}
          >
            Refresh
          </Button>
        }
      >
        {entities.length === 0 ? (
          <Empty description="No entities available" />
        ) : (
          <Row gutter={[16, 16]}>
            {entities.map((entity) => (
              <Col key={entity.entity_id} xs={24} sm={12} md={8} lg={6}>
                <Card size="small" style={{ background: '#fafafa' }}>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                    {entity.entity_id}
                  </Text>
                  <Text strong>{entity.state}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Card>
    </Space>
  )
}
