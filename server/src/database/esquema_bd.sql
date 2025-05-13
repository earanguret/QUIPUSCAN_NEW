-- Crear esquemas
CREATE SCHEMA IF NOT EXISTS archivo;
CREATE SCHEMA IF NOT EXISTS maestro;

-- ====================
-- TABLAS DEL ESQUEMA: archivo
-- ====================

-- Tabla: archivo.t_persona
CREATE TABLE archivo.t_persona (
    f_aud timestamp,
    b_aud char(1),
    c_aud_uid varchar(30),
    c_aud_uidred varchar(30),
    c_aud_pc varchar(30),
    c_aud_ip varchar(15),
    c_aud_mac varchar(17),
    create_at timestamp,
    id_persona serial PRIMARY KEY,
    nombre varchar,
    ap_paterno varchar,
    ap_materno varchar,
    dni varchar UNIQUE
);

-- Tabla: archivo.t_usuario
CREATE TABLE archivo.t_usuario (
    f_aud timestamp,
    b_aud char(1),
    c_aud_uid varchar(30),
    c_aud_uidred varchar(30),
    c_aud_pc varchar(30),
    c_aud_ip varchar(15),
    c_aud_mac varchar(17),
    create_at timestamp,
    id_usuario serial PRIMARY KEY,
    id_persona integer REFERENCES archivo.t_persona(id_persona),
    perfil varchar,
    username varchar UNIQUE,
    password varchar,
    estado boolean,
    intentos_login integer
);

-- Tabla: archivo.t_inventario
CREATE TABLE archivo.t_inventario (
    f_aud timestamp,
    b_aud char(1),
    c_aud_uid varchar(30),
    c_aud_uidred varchar(30),
    c_aud_pc varchar(30),
    c_aud_ip varchar(15),
    c_aud_mac varchar(17),
    create_at timestamp,
    id_inventario serial PRIMARY KEY,
    id_responsable integer REFERENCES archivo.t_usuario(id_usuario),
    anio integer,
    cantidad integer,
    tipo_doc varchar,
    serie_doc varchar,
    especialidad varchar,
    codigo varchar UNIQUE,
    sede varchar
);

-- Tabla: archivo.t_expediente
CREATE TABLE archivo.t_expediente (
    f_aud timestamp,
    b_aud char(1),
    c_aud_uid varchar(30),
    c_aud_uidred varchar(30),
    c_aud_pc varchar(30),
    c_aud_ip varchar(15),
    c_aud_mac varchar(17),
    create_at timestamp,
    id_expediente serial PRIMARY KEY,
    id_inventario integer REFERENCES archivo.t_inventario(id_inventario),
    id_responsable integer REFERENCES archivo.t_usuario(id_usuario),
    nro_expediente varchar UNIQUE,
    juzgado_origen varchar,
    tipo_proceso varchar,
    materia varchar,
    demandante varchar,
    demandado varchar,
    fecha_inicial date,
    fecha_final date
);

-- Tabla: archivo.t_digitalizacion
CREATE TABLE archivo.t_digitalizacion (
    f_aud timestamp,
    b_aud char(1),
    c_aud_uid varchar(30),
    c_aud_uidred varchar(30),
    c_aud_pc varchar(30),
    c_aud_ip varchar(15),
    c_aud_mac varchar(17),
    create_at timestamp,
    id_digitalizacion serial PRIMARY KEY,
    id_expediente integer UNIQUE REFERENCES archivo.t_expediente(id_expediente),
    id_responsable integer REFERENCES archivo.t_usuario(id_usuario),
    fojas_total integer,
    ocr boolean,
    escala_gris boolean,
    color boolean,
    observaciones varchar,
    dir_ftp varchar,
    hash_doc varchar,
    peso_doc integer
);

-- Tabla: archivo.t_indizacion
CREATE TABLE archivo.t_indizacion (
    f_aud timestamp,
    b_aud char(1),
    c_aud_uid varchar(30),
    c_aud_uidred varchar(30),
    c_aud_pc varchar(30),
    c_aud_ip varchar(15),
    c_aud_mac varchar(17),
    create_at timestamp,
    id_indizacion serial PRIMARY KEY,
    id_expediente integer UNIQUE REFERENCES archivo.t_expediente(id_expediente),
    id_responsable integer REFERENCES archivo.t_usuario(id_usuario),
    indizacion varchar,
    observaciones varchar
);

-- Tabla: archivo.t_control
CREATE TABLE archivo.t_control (
    f_aud timestamp,
    b_aud char(1),
    c_aud_uid varchar(30),
    c_aud_uidred varchar(30),
    c_aud_pc varchar(30),
    c_aud_ip varchar(15),
    c_aud_mac varchar(17),
    create_at timestamp,
    id_control serial PRIMARY KEY,
    id_expediente integer UNIQUE REFERENCES archivo.t_expediente(id_expediente),
    id_responsable integer REFERENCES archivo.t_usuario(id_usuario),
    observaciones varchar,
    val_observaciones boolean,
    val_datos boolean,
    val_nitidez boolean,
    val_pruebas_impresion boolean,
    val_copia_fiel boolean
);

-- Tabla: archivo.t_fedatar
CREATE TABLE archivo.t_fedatar (
    f_aud timestamp,
    b_aud char(1),
    c_aud_uid varchar(30),
    c_aud_uidred varchar(30),
    c_aud_pc varchar(30),
    c_aud_ip varchar(15),
    c_aud_mac varchar(17),
    create_at timestamp,
    id_fedatar serial PRIMARY KEY,
    id_expediente integer UNIQUE REFERENCES archivo.t_expediente(id_expediente),
    id_responsable integer REFERENCES archivo.t_usuario(id_usuario),
    observaciones varchar
);

-- Tabla: archivo.t_preparacion
CREATE TABLE archivo.t_preparacion (
    f_aud timestamp,
    b_aud char(1),
    c_aud_uid varchar(30),
    c_aud_uidred varchar(30),
    c_aud_pc varchar(30),
    c_aud_ip varchar(15),
    c_aud_mac varchar(17),
    create_at timestamp,
    id_preparacion serial PRIMARY KEY,
    id_responsable integer REFERENCES archivo.t_usuario(id_usuario),
    fojas_total integer,
    fojas_unacara integer,
    fojas_doscaras integer,
    observaciones varchar,
    copias_originales boolean,
    copias_simples boolean
);

-- Tabla: archivo.t_cd
CREATE TABLE archivo.t_cd (
    f_aud timestamp,
    b_aud char(1),
    c_aud_uid varchar(30),
    c_aud_uidred varchar(30),
    c_aud_pc varchar(30),
    c_aud_ip varchar(15),
    c_aud_mac varchar(17),
    id_cd serial PRIMARY KEY,
    id_inventario integer REFERENCES archivo.t_inventario(id_inventario),
    nombre varchar,
    capacidad integer,
    peso_ocupado integer,
    dir_ftp_acta_apertura varchar,
    dir_ftp_acta_cierre varchar,
    dir_ftp_tarjeta_apertura varchar,
    dir_ftp_tarjeta_cierre varchar,
    peso_acta_apertura integer,
    peso_acta_cierre integer,
    peso_tarjeta_apertura integer,
    peso_tarjeta_cierre integer,
    fecha_acta_apertura timestamp,
    fecha_acta_cierre timestamp,
    fecha_tarjeta_apertura timestamp,
    fecha_tarjeta_cierre timestamp
);

-- Tabla: archivo.t_estado_expediente
CREATE TABLE archivo.t_estado_expediente (
    f_aud timestamp,
    b_aud char(1),
    c_aud_uid varchar(30),
    c_aud_uidred varchar(30),
    c_aud_pc varchar(30),
    c_aud_ip varchar(15),
    c_aud_mac varchar(17),
    id_estado_expediente serial PRIMARY KEY,
    id_expediente integer UNIQUE REFERENCES archivo.t_expediente(id_expediente),
    estado_recepcionado char(1),
    estado_preparado char(1),
    estado_digitalizado char(1),
    estado_indizado char(1),
    estado_controlado char(1),
    estado_fedatado char(1),
    id_cd integer REFERENCES archivo.t_cd(id_cd),
    mensajes varchar
);

-- Tabla: archivo.t_flujograma
CREATE TABLE archivo.t_flujograma (
    f_aud timestamp,
    b_aud char(1),
    c_aud_uid varchar(30),
    c_aud_uidred varchar(30),
    c_aud_pc varchar(30),
    c_aud_ip varchar(15),
    c_aud_mac varchar(17),
    create_at timestamp DEFAULT CURRENT_TIMESTAMP,
    id_flujograma serial PRIMARY KEY,
    id_expediente integer REFERENCES archivo.t_expediente(id_expediente),
    id_responsable integer REFERENCES archivo.t_usuario(id_usuario),
    area varchar
);

-- ====================
-- TABLAS DEL ESQUEMA: maestro
-- ====================

-- Tabla: maestro.t_tipo_documento
CREATE TABLE maestro.t_tipo_documento (
    f_aud timestamp,
    b_aud char(1),
    c_aud_uid varchar(30),
    c_aud_uidred varchar(30),
    c_aud_pc varchar(30),
    c_aud_ip varchar(15),
    c_aud_mac varchar(17),
    create_at timestamp DEFAULT CURRENT_TIMESTAMP,
    id_tipo_documento serial PRIMARY KEY,
    tipo_documento varchar
);

-- Tabla: maestro.t_especialidad
CREATE TABLE maestro.t_especialidad (
    f_aud timestamp,
    b_aud char(1),
    c_aud_uid varchar(30),
    c_aud_uidred varchar(30),
    c_aud_pc varchar(30),
    c_aud_ip varchar(15),
    c_aud_mac varchar(17),
    create_at timestamp DEFAULT CURRENT_TIMESTAMP,
    id_especialidad serial PRIMARY KEY,
    especialidad varchar
);

-- Tabla: maestro.t_sede
CREATE TABLE maestro.t_sede (
    f_aud timestamp,
    b_aud char(1),
    c_aud_uid varchar(30),
    c_aud_uidred varchar(30),
    c_aud_pc varchar(30),
    c_aud_ip varchar(15),
    c_aud_mac varchar(17),
    create_at timestamp DEFAULT CURRENT_TIMESTAMP,
    id_sede serial PRIMARY KEY,
    sede varchar
);

-- Tabla: maestro.t_tipo_proceso
CREATE TABLE maestro.t_tipo_proceso (
    f_aud timestamp,
    b_aud char(1),
    c_aud_uid varchar(30),
    c_aud_uidred varchar(30),
    c_aud_pc varchar(30),
    c_aud_ip varchar(15),
    c_aud_mac varchar(17),
    create_at timestamp DEFAULT CURRENT_TIMESTAMP,
    id_tipo_proceso serial PRIMARY KEY,
    tipo_proceso varchar
);

-- Tabla: maestro.t_materia
CREATE TABLE maestro.t_materia (
    f_aud timestamp,
    b_aud char(1),
    c_aud_uid varchar(30),
    c_aud_uidred varchar(30),
    c_aud_pc varchar(30),
    c_aud_ip varchar(15),
    c_aud_mac varchar(17),
    create_at timestamp DEFAULT CURRENT_TIMESTAMP,
    id_materia serial PRIMARY KEY,
    materia varchar
);

-- Tabla: maestro.t_juzgado
CREATE TABLE maestro.t_juzgado (
    f_aud timestamp,
    b_aud char(1),
    c_aud_uid varchar(30),
    c_aud_uidred varchar(30),
    c_aud_pc varchar(30),
    c_aud_ip varchar(15),
    c_aud_mac varchar(17),
    create_at timestamp DEFAULT CURRENT_TIMESTAMP,
    id_juzgado serial PRIMARY KEY,
    juzgado varchar
);
