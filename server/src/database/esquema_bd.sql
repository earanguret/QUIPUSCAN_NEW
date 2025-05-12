CREATE SCHEMA IF NOT EXISTS archivo;
SET search_path TO archivo;

-- Tabla t_perfil
CREATE TABLE archivo.t_perfil (
    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_perfil SERIAL PRIMARY KEY,
    perfil VARCHAR UNIQUE,
    mdl_recepcion BOOLEAN,
    mdl_preparacion BOOLEAN,
    mdl_digitalizacion BOOLEAN,
    mdl_indizacion BOOLEAN,
    mdl_control_calidad BOOLEAN,
    mdl_fedatar BOOLEAN,
    mdl_boveda BOOLEAN,
    mdl_reportes BOOLEAN,
    mdl_usuarios BOOLEAN,
    mdl_configuracion BOOLEAN
);

-- Tabla t_persona
CREATE TABLE archivo.t_persona (
    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_persona SERIAL PRIMARY KEY,
    nombre VARCHAR,
    ap_paterno VARCHAR,
    ap_materno VARCHAR,
    dni VARCHAR UNIQUE
);

-- Tabla t_usuario
CREATE TABLE archivo.t_usuario (
    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),
    create_at TIMESTAMP,
    id_usuario SERIAL PRIMARY KEY,
    id_persona INTEGER REFERENCES archivo.t_persona(id_persona),
    id_perfil INTEGER REFERENCES archivo.t_perfil(id_perfil),
    username VARCHAR UNIQUE,
    password VARCHAR,
    estado BOOLEAN,
    intentos_login INTEGER
);

-- Tabla t_inventario
CREATE TABLE archivo.t_inventario (
    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),
    create_at TIMESTAMP,
    id_inventario SERIAL PRIMARY KEY,
    id_responsable INTEGER REFERENCES archivo.t_usuario(id_usuario),
    anio INTEGER,
    cantidad INTEGER,
    tipo_doc VARCHAR,
    serie_doc VARCHAR,
    especialidad VARCHAR,
    codigo VARCHAR UNIQUE,
    sede VARCHAR
);

-- Tabla t_expediente
CREATE TABLE archivo.t_expediente (
    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),
    create_at TIMESTAMP,
    id_expediente SERIAL PRIMARY KEY,
    id_inventario INTEGER REFERENCES archivo.t_inventario(id_inventario),
    id_responsable INTEGER REFERENCES archivo.t_usuario(id_usuario),
    nro_expediente VARCHAR UNIQUE,
    juzgado_origen VARCHAR,
    tipo_proceso VARCHAR,
    materia VARCHAR,
    demandante VARCHAR,
    demandado VARCHAR,
    fecha_inicial DATE,
    fecha_final DATE
);

-- Tabla t_digitalizacion
CREATE TABLE archivo.t_digitalizacion (
    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),
    create_at TIMESTAMP,
    id_digitalizacion SERIAL PRIMARY KEY,
    id_expediente INTEGER UNIQUE REFERENCES archivo.t_expediente(id_expediente),
    id_responsable INTEGER REFERENCES archivo.t_usuario(id_usuario),
    fojas_total INTEGER,
    ocr BOOLEAN,
    escala_gris BOOLEAN,
    color BOOLEAN,
    observaciones VARCHAR,
    dir_ftp VARCHAR,
    hash_doc VARCHAR,
    peso_doc INTEGER
);

-- Tabla t_control
CREATE TABLE archivo.t_control (
    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),
    create_at TIMESTAMP,
    id_control SERIAL PRIMARY KEY,
    id_expediente INTEGER UNIQUE REFERENCES archivo.t_expediente(id_expediente),
    id_responsable INTEGER REFERENCES archivo.t_usuario(id_usuario),
    observaciones VARCHAR,
    val_observaciones BOOLEAN,
    val_datos BOOLEAN,
    val_nitidez BOOLEAN,
    val_pruebas_impresion BOOLEAN,
    val_copia_fiel BOOLEAN
);

-- Tabla t_indizacion
CREATE TABLE archivo.t_indizacion (
    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),
    create_at TIMESTAMP,
    id_indizacion SERIAL PRIMARY KEY,
    id_expediente INTEGER UNIQUE REFERENCES archivo.t_expediente(id_expediente),
    id_responsable INTEGER REFERENCES archivo.t_usuario(id_usuario),
    indizacion VARCHAR,
    observaciones VARCHAR
);

-- Tabla t_fedatar
CREATE TABLE archivo.t_fedatar (
    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),
    create_at TIMESTAMP,
    id_fedatar SERIAL PRIMARY KEY,
    id_expediente INTEGER UNIQUE REFERENCES archivo.t_expediente(id_expediente),
    id_responsable INTEGER REFERENCES archivo.t_usuario(id_usuario),
    observaciones VARCHAR
);

-- Tabla t_cd
CREATE TABLE archivo.t_cd (
    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),
    id_cd SERIAL PRIMARY KEY,
    id_inventario INTEGER REFERENCES archivo.t_inventario(id_inventario),
    nombre VARCHAR,
    capacidad INTEGER,
    peso_ocupado INTEGER,
    dir_ftp_acta_apertura VARCHAR,
    dir_ftp_acta_cierre VARCHAR,
    dir_ftp_tarjeta_apertura VARCHAR,
    dir_ftp_tarjeta_cierre VARCHAR,
    peso_acta_apertura INTEGER,
    peso_acta_cierre INTEGER,
    peso_tarjeta_apertura INTEGER,
    peso_tarjeta_cierre INTEGER,
    fecha_acta_apertura TIMESTAMP,
    fecha_acta_cierre TIMESTAMP,
    fecha_tarjeta_apertura TIMESTAMP,
    fecha_tarjeta_cierre TIMESTAMP
);

-- Tabla t_estado_expediente
CREATE TABLE archivo.t_estado_expediente (
    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),
    id_estado_expediente SERIAL PRIMARY KEY,
    id_expediente INTEGER UNIQUE REFERENCES archivo.t_expediente(id_expediente),
    estado_recepcionado CHAR(1),
    estado_preparado CHAR(1),
    estado_digitalizado CHAR(1),
    estado_indizado CHAR(1),
    estado_controlado CHAR(1),
    estado_fedatado CHAR(1),
    id_cd INTEGER REFERENCES archivo.t_cd(id_cd),
    mensajes VARCHAR
);

-- Tabla t_preparacion
CREATE TABLE archivo.t_preparacion (
    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),
    create_at TIMESTAMP,
    id_preparacion SERIAL PRIMARY KEY,
    id_responsable INTEGER REFERENCES archivo.t_usuario(id_usuario),
    fojas_total INTEGER,
    fojas_unacara INTEGER,
    fojas_doscaras INTEGER,
    observaciones VARCHAR,
    copias_originales BOOLEAN,
    copias_simples BOOLEAN
);

-- Tabla t_flujograma
CREATE TABLE archivo.t_flujograma (
    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_flujograma SERIAL PRIMARY KEY,
    id_expediente INTEGER REFERENCES archivo.t_expediente(id_expediente),
    id_responsable INTEGER REFERENCES archivo.t_usuario(id_usuario),
    area VARCHAR
);

-- Tablas t_tipo_documento, t_especialidad, t_sede, t_tipo_proceso, t_materia, t_juzgado
CREATE TABLE archivo.t_tipo_documento (
    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_tipo_documento SERIAL PRIMARY KEY,
    tipo_documento VARCHAR
);

CREATE TABLE archivo.t_especialidad (
    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_especialidad SERIAL PRIMARY KEY,
    especialidad VARCHAR
);

CREATE TABLE archivo.t_sede (
    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_sede SERIAL PRIMARY KEY,
    sede VARCHAR
);

CREATE TABLE archivo.t_tipo_proceso (
    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_tipo_proceso SERIAL PRIMARY KEY,
    tipo_proceso VARCHAR
);

CREATE TABLE archivo.t_materia (
    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_materia SERIAL PRIMARY KEY,
    materia VARCHAR
);

CREATE TABLE archivo.t_juzgado (
    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_juzgado SERIAL PRIMARY KEY,
    juzgado VARCHAR
);
