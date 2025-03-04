import { Table, Card, Tooltip, Typography } from "antd";

const { Text } = Typography;

const CustomTable = ({ columns, data }) => {
  return (
    <div className="custom-table-container">
      {data.map((file, index) => (
        <Card key={file.fileId} className="custom-card">
          <div className="card-content">
            {columns.map((col) => (
              <div key={col.key} className="card-item">
                <Text strong className="card-label">
                  {col.title}
                </Text>
                {col.dataIndex === "fileName" ? (
                  <Tooltip title={file[col.dataIndex]}>
                    <Text className="card-value">
                      {file[col.dataIndex].length > 15
                        ? `${file[col.dataIndex].substring(0, 15)}...`
                        : file[col.dataIndex]}
                    </Text>
                  </Tooltip>
                ) : (
                  <Text className="card-value">{file[col.dataIndex]}</Text>
                )}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CustomTable;
