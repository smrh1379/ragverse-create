import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react";
import { SUPPORTED_FILE_TYPES, MAX_FILE_SIZE, RAGService } from "@/lib/ragverse";
import { toast } from "@/components/ui/sonner";

interface FileUploadProps {
  universeId: string;
  onUploadComplete?: () => void;
}

interface UploadFile {
  file: File;
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
  progress: number;
  error?: string;
}

export const FileUpload = ({ universeId, onUploadComplete }: FileUploadProps) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const ragService = RAGService.getInstance();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      status: 'pending' as const,
      progress: 0
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: SUPPORTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach(error => {
          if (error.code === 'file-too-large') {
            toast.error(`${file.name} is too large. Maximum size is 100MB.`);
          } else if (error.code === 'file-invalid-type') {
            toast.error(`${file.name} is not a supported file type.`);
          }
        });
      });
    }
  });

  const uploadFile = async (index: number) => {
    const uploadFile = files[index];
    if (!uploadFile) return;

    try {
      // Update status to uploading
      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, status: 'uploading', progress: 0 } : f
      ));

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map((f, i) => 
          i === index && f.progress < 90 
            ? { ...f, progress: f.progress + 10 } 
            : f
        ));
      }, 200);

      // Upload file
      const filePath = await ragService.uploadFile(uploadFile.file, universeId);
      
      clearInterval(progressInterval);
      
      // Update to processing
      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, status: 'processing', progress: 100 } : f
      ));

      // Process file (chunking and embedding)
      await ragService.processFile(filePath, universeId);

      // Mark as complete
      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, status: 'complete' } : f
      ));

      toast.success(`${uploadFile.file.name} processed successfully!`);
      onUploadComplete?.();

    } catch (error) {
      setFiles(prev => prev.map((f, i) => 
        i === index ? { 
          ...f, 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Upload failed' 
        } : f
      ));
      toast.error(`Failed to upload ${uploadFile.file.name}`);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadAll = () => {
    files.forEach((file, index) => {
      if (file.status === 'pending') {
        uploadFile(index);
      }
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-lg mb-2">Drag & drop files here, or click to select</p>
                <p className="text-sm text-muted-foreground">
                  Supports PDF, TXT, MD, CSV, DOCX up to 100MB each
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Files to Upload</h3>
              <Button 
                onClick={uploadAll} 
                disabled={!files.some(f => f.status === 'pending')}
                size="sm"
              >
                Upload All
              </Button>
            </div>
            
            <div className="space-y-3">
              {files.map((uploadFile, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <File className="h-5 w-5 text-muted-foreground" />
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{uploadFile.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    
                    {uploadFile.status === 'uploading' && (
                      <Progress value={uploadFile.progress} className="mt-2" />
                    )}
                    
                    {uploadFile.error && (
                      <p className="text-xs text-destructive mt-1">{uploadFile.error}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {uploadFile.status === 'pending' && (
                      <Button size="sm" variant="outline" onClick={() => uploadFile(index)}>
                        Upload
                      </Button>
                    )}
                    
                    {uploadFile.status === 'uploading' && (
                      <Badge variant="secondary">Uploading...</Badge>
                    )}
                    
                    {uploadFile.status === 'processing' && (
                      <Badge variant="secondary">Processing...</Badge>
                    )}
                    
                    {uploadFile.status === 'complete' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    
                    {uploadFile.status === 'error' && (
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(index)}
                      disabled={uploadFile.status === 'uploading' || uploadFile.status === 'processing'}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};