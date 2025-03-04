import { Card, Tooltip, Typography } from "antd";
import { FileTextOutlined, CalendarOutlined } from "@ant-design/icons";

const { Text } = Typography;

const GoogleStyleTable = ({ data }) => {
  return (
    <div className="google-table-container">
      {data.map((file) => (
        <Card key={file.fileId} className="google-card">
          <div className="google-card-content">
            <div className="file-header">
              <FileTextOutlined className="file-icon" />
              <Tooltip title={file.fileName}>
                <Text className="file-name">
                  {file.fileName.length > 15 ? `${file.fileName.substring(0, 15)}...` : file.fileName}
                </Text>
              </Tooltip>
            </div>

            <div className="file-info">
              <CalendarOutlined className="icon" />
              <Text className="date-text">{file.updatedOn}</Text>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default GoogleStyleTable;
