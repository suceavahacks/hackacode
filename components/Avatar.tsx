const Avatar = ({ src, alt, size = 30 }: { src: string; alt: string; size?: number }) => {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        objectFit: 'cover',
      }}
    />
  );
}

export default Avatar;