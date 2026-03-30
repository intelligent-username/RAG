import UploadForm from "./UploadForm";

interface Props {
  onAdd: (name: string, files: File[]) => void;
}

export default function UploadPanel({ onAdd }: Props) {
  return <UploadForm onAdd={onAdd} resetAfterAdd={true} />;
}
