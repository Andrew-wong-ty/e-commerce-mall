package com.example.mall.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.UUID;

@Controller
@RequestMapping("/files")
@Slf4j
public class FileController {
    @Value("${project.filepath}")
    private String FILE_UPLOAD_PATH;
//    private static final String FILE_UPLOAD_PATH = "C:\\Users\\24508\\IdeaProjects\\e-commerce-mall\\mall\\src\\main\\resources\\upload"; // 上传文件保存的路径

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String originalFileName = file.getOriginalFilename();
            assert originalFileName != null;
            String newFileName = UUID.randomUUID().toString() + "-FILE-" + originalFileName;

            File targetFile = new File(FILE_UPLOAD_PATH + File.separator + newFileName);
            FileOutputStream outputStream = new FileOutputStream(targetFile);
            InputStream inputStream = file.getInputStream();
            FileCopyUtils.copy(inputStream, outputStream);
            outputStream.close();
            inputStream.close();

            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/files/download/")
                    .path(newFileName)
                    .toUriString();

            return ResponseEntity.ok().body(fileDownloadUri);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Failed to upload file.");
        }
    }

    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable String fileName) {
        try {
            File file = new File(FILE_UPLOAD_PATH + File.separator + fileName);
            byte[] fileContent = FileCopyUtils.copyToByteArray(file);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", URLEncoder.encode(fileName, "UTF-8"));
            headers.setContentLength(fileContent.length);

            return new ResponseEntity<>(fileContent, headers, 200);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
