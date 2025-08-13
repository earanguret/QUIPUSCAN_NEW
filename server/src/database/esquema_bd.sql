-- Crear esquemas
CREATE SCHEMA IF NOT EXISTS archivo;
CREATE SCHEMA IF NOT EXISTS maestro;
CREATE SCHEMA IF NOT EXISTS auditoria;

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
    cod_paquete varchar(10)
   
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
    id_expediente integer UNIQUE REFERENCES archivo.t_expediente(id_expediente),
    id_responsable integer REFERENCES archivo.t_usuario(id_usuario),
    fojas_total integer,
    fojas_unacara integer,
    fojas_doscaras integer,
    observaciones varchar,
    copias_originales boolean,
    copias_simples boolean
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
    indice varchar,
    observaciones varchar,
    juzgado_origen varchar,
    tipo_proceso varchar,
    materia varchar,
    demandante varchar,
    demandado varchar,
    fecha_inicial date,
    fecha_final date
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



-- Tabla: archivo.t_disco
CREATE TABLE archivo.t_disco (
    f_aud timestamp,
    b_aud char(1),
    c_aud_uid varchar(30),
    c_aud_uidred varchar(30),
    c_aud_pc varchar(30),
    c_aud_ip varchar(15),
    c_aud_mac varchar(17),

    create_at timestamp,
    id_disco serial PRIMARY KEY,
    id_inventario integer REFERENCES archivo.t_inventario(id_inventario),
    id_responsable_crear integer REFERENCES archivo.t_usuario(id_usuario),
    nombre varchar,
    volumen integer,
    capacidad_gb integer,
    espacio_ocupado numeric(5,2),
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
    fecha_tarjeta_cierre timestamp,
    id_responsable_tca integer REFERENCES archivo.t_usuario(id_usuario),
    id_responsable_tcc integer REFERENCES archivo.t_usuario(id_usuario),
    id_responsable_aa integer REFERENCES archivo.t_usuario(id_usuario),
    id_responsable_ac integer REFERENCES archivo.t_usuario(id_usuario),
    estado_cerrado boolean,
    id_responsable_cierre integer REFERENCES archivo.t_usuario(id_usuario)
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
    create_at timestamp,
    id_estado_expediente serial PRIMARY KEY,
    id_expediente integer UNIQUE REFERENCES archivo.t_expediente(id_expediente),
    estado_recepcionado char(1),
    estado_preparado char(1),
    estado_digitalizado char(1),
    estado_indizado char(1),
    estado_controlado char(1),
    estado_fedatado char(1),
    estado_finalizado char(1),
    id_disco integer REFERENCES archivo.t_disco(id_disco),
    mensajes jsonb
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

--------------------------------------------------------
--  Insertar datos de ejemplo
--------------------------------------------------------
INSERT INTO archivo.t_persona(
    f_aud, 
    b_aud, 
    c_aud_uid, 
    c_aud_uidred, 
    c_aud_pc, 
    c_aud_ip, 
    c_aud_mac, 
    create_at,  
    nombre, 
    ap_paterno, 
    ap_materno, 
    dni
)
VALUES (
    CURRENT_TIMESTAMP,   -- f_aud
    'I',                 -- b_aud: operación Insert
    NULL,                -- c_aud_uid: usuario responsable
    NULL,                 -- c_aud_uidred
    NULL,                -- c_aud_pc
    NULL,                -- c_aud_ip
    NULL,                -- c_aud_mac
    CURRENT_TIMESTAMP,   -- create_at
    'ERNESTO FRANCISCO', -- nombre
    'ARANGURE',          -- ap_paterno
    'TORRES',            -- ap_materno
    '74557359'           -- dni
);

--insertar datos de usuario ADMIN, con password 123456
INSERT INTO archivo.t_usuario(
	f_aud, 
	b_aud, 
	c_aud_uid, 
	c_aud_uidred, 
	c_aud_pc, 
	c_aud_ip, 
	c_aud_mac, 
	create_at, 
	id_persona, 
	perfil, 
	username, 
	password, 
	estado, 
	intentos_login)
	VALUES (
	CURRENT_TIMESTAMP, 
	'I', 
	null, 
	null, 
	null, 
	null, 
	null, 
	CURRENT_TIMESTAMP, 
	1, 
	'ADMINISTRADOR', 
	'ADMIN', 
	'$2b$10$Okrv.qgAZhFJmgOBnOg0be6ZkEDwHsw4nIgw47OmEDJvm9PBZZwAq', 
	true, 
	0);


-- funcion que actualiza automaticamente la cantidad de expedientes en la tabla de inventario
CREATE OR REPLACE FUNCTION actualizar_cantidad_inventario()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE archivo.t_inventario
    SET cantidad = cantidad + 1
    WHERE id_inventario = NEW.id_inventario;

  ELSIF TG_OP = 'DELETE' THEN
    UPDATE archivo.t_inventario
    SET cantidad = cantidad - 1
    WHERE id_inventario = OLD.id_inventario;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;


-- Trigger para inserciones
CREATE TRIGGER trg_incrementar_cantidad
AFTER INSERT ON archivo.t_expediente
FOR EACH ROW
EXECUTE FUNCTION actualizar_cantidad_inventario();

-- Trigger para eliminaciones
CREATE TRIGGER trg_decrementar_cantidad
AFTER DELETE ON archivo.t_expediente
FOR EACH ROW
EXECUTE FUNCTION actualizar_cantidad_inventario();


-- ====================
-- TABLAS DEL ESQUEMA: auditoria
-- ====================

-- Tabla: auditoria.t_logs_accesos
CREATE TABLE auditoria.t_logs_accesos (
    id_log_acceso SERIAL PRIMARY KEY,
    direccion_ip VARCHAR,
    usuario VARCHAR,
    detalle VARCHAR,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: auditoria.t_logs_eventos
CREATE TABLE auditoria.t_logs_eventos (
    id_log_evento SERIAL PRIMARY KEY,
    direccion_ip VARCHAR,
    usuario VARCHAR,
    modulo VARCHAR,
    detalle VARCHAR,
    expediente VARCHAR,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



---------------------------------------------------------------
--CREACION DE TABLAS DE AUDITORIA Y TRIGERS DE TRAZABILIDAD
---------------------------------------------------------------
-- 1.- INVENTARIO 
---------------------------------------------------------------

CREATE TABLE auditoria.aud_t_inventario (
    n_trns_id SERIAL PRIMARY KEY,
	
    f_trns TIMESTAMP,
    b_trns CHAR(1),
    c_trns_uidred VARCHAR(30),
    c_trns_pc VARCHAR(30),
    c_trns_ip VARCHAR(15),
    c_trns_mac VARCHAR(17),

    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),

    create_at TIMESTAMP,
    id_inventario INTEGER,
    id_responsable INTEGER,
    anio INTEGER,
    cantidad INTEGER,
    tipo_doc VARCHAR,
    serie_doc VARCHAR,
    especialidad VARCHAR,
    codigo VARCHAR,
    sede VARCHAR
);

-- TRIGGER INVENTARIO 
CREATE OR REPLACE FUNCTION archivo.ufn_auditar_t_inventario_upd() 
RETURNS TRIGGER AS $$
BEGIN
    -- Insertar los datos antes de la modificación en la tabla de auditoría
    INSERT INTO auditoria.aud_t_inventario (
        f_trns,               -- Fecha de la transacción
        b_trns,               -- Indicador de transacción ('U' para update)
        c_trns_uidred,        -- Usuario que hizo la modificación
        c_trns_pc,            -- PC
        c_trns_ip,            -- IP
        c_trns_mac,           -- MAC

		f_aud,                -- Fecha de auditoría anterior
        b_aud,                -- Indicador de auditoría anterior
        c_aud_uid,            -- UID de auditoría anterior
        c_aud_uidred,         -- UID de red anterior
        c_aud_pc,             -- PC anterior
        c_aud_ip,             -- IP anterior
        c_aud_mac,             -- MAC anterior

          create_at,
		  id_inventario,
		  id_responsable,
		  anio,
		  cantidad,
		  tipo_doc,
		  serie_doc,
		  especialidad,
		  codigo,
		  sede
		
    ) VALUES (
        CURRENT_TIMESTAMP,    -- Fecha de la transacción actual
        'U',                  -- Indicador de transacción (U para update)
        NEW.c_aud_uidred,        -- Usuario que hizo la modificación (nuevos datos)
        NEW.c_aud_pc,         -- PC (nuevos datos)
        NEW.c_aud_ip,         -- IP (nuevos datos)
        NEW.c_aud_mac,        -- MAC (nuevos datos)

		OLD.f_aud,            -- Fecha de auditoría antes de la modificación
        OLD.b_aud,            -- Indicador de auditoría antes de la modificación
        OLD.c_aud_uid,        -- UID de auditoría anterior
        OLD.c_aud_uidred,     -- UID de red anterior
        OLD.c_aud_pc,         -- PC anterior
        OLD.c_aud_ip,         -- IP anterior
        OLD.c_aud_mac,         -- MAC anterior
		
			OLD.create_at,
        	OLD.id_inventario,
		    OLD.id_responsable,
		    OLD.anio,
		    OLD.cantidad,
		    OLD.tipo_doc,
		    OLD.serie_doc,
		    OLD.especialidad,
		    OLD.codigo,
		    OLD.sede
    );

    -- Continuar con la operación de actualización
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER utg_t_inventario_upd
AFTER UPDATE ON archivo.t_inventario
FOR EACH ROW
EXECUTE FUNCTION archivo.ufn_auditar_t_inventario_upd();

CREATE OR REPLACE FUNCTION archivo.ufn_auditar_t_inventario_del()
RETURNS TRIGGER AS $$
BEGIN
  -- Insertar en la tabla de auditoría los datos antes de la eliminación
  INSERT INTO auditoria.aud_t_inventario (
      f_trns, 
	  b_trns, 
	  c_trns_uidred, 
	  c_trns_pc, 
	  c_trns_ip, 
	  c_trns_mac,

	  f_aud, 
	  b_aud, 
	  c_aud_uid, 
	  c_aud_uidred, 
	  c_aud_pc, 
	  c_aud_ip, 
	  c_aud_mac,
	  
	  	  create_at,
		  id_inventario,
		  id_responsable,
		  anio,
		  cantidad,
		  tipo_doc,
		  serie_doc,
		  especialidad,
		  codigo,
		  sede    
  )
  VALUES (
    CURRENT_TIMESTAMP, -- Fecha y hora de la transacción
	'D',
	current_setting('myapp.c_trns_uidred', true), -- Parámetro de sesión para c_trns_uid
    current_setting('myapp.c_trns_pc', true), -- Parámetro de sesión para c_trns_pc
    current_setting('myapp.c_trns_ip', true), -- Parámetro de sesión para c_trns_ip
    current_setting('myapp.c_trns_mac', true), -- Parámetro de sesión para c_trns_mac

	OLD.f_aud, 
	OLD.b_aud, 
	OLD.c_aud_uid, 
	OLD.c_aud_uidred, 
	OLD.c_aud_pc, 
	OLD.c_aud_ip, 
	OLD.c_aud_mac,
	
       	  OLD.create_at,
		  OLD.id_inventario,
		  OLD.id_responsable,
		  OLD.anio,
		  OLD.cantidad,
		  OLD.tipo_doc,
		  OLD.serie_doc,
		  OLD.especialidad,
		  OLD.codigo,
		  OLD.sede    
  );

  RETURN OLD; -- Devolver OLD en un trigger antes de eliminar
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER utg_t_inventario_del
BEFORE DELETE ON archivo.t_inventario
FOR EACH ROW
EXECUTE FUNCTION archivo.ufn_auditar_t_inventario_del();


-------------------------------------------------------------------------------------------------------
-- 2.- EXPEDIENTE 
-------------------------------------------------------------------------------------------------------
CREATE TABLE auditoria.aud_t_expediente (
    n_trns_id SERIAL PRIMARY KEY,
	
    f_trns TIMESTAMP,
    b_trns CHAR(1),
    c_trns_uidred VARCHAR(30),
    c_trns_pc VARCHAR(30),
    c_trns_ip VARCHAR(15),
    c_trns_mac VARCHAR(17),

    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),

	    create_at timestamp,
	    id_expediente integer,
	    id_inventario integer,
	    id_responsable integer,
	    nro_expediente varchar,
	    cod_paquete varchar
);

-- TRIGGER INVENTARIO 
CREATE OR REPLACE FUNCTION archivo.ufn_auditar_t_expediente_upd() 
RETURNS TRIGGER AS $$
BEGIN
    -- Insertar los datos antes de la modificación en la tabla de auditoría
    INSERT INTO auditoria.aud_t_expediente (
        f_trns,               -- Fecha de la transacción
        b_trns,               -- Indicador de transacción ('U' para update)
        c_trns_uidred,        -- Usuario que hizo la modificación
        c_trns_pc,            -- PC
        c_trns_ip,            -- IP
        c_trns_mac,           -- MAC

		f_aud,                -- Fecha de auditoría anterior
        b_aud,                -- Indicador de auditoría anterior
        c_aud_uid,            -- UID de auditoría anterior
        c_aud_uidred,         -- UID de red anterior
        c_aud_pc,             -- PC anterior
        c_aud_ip,             -- IP anterior
        c_aud_mac,             -- MAC anterior

          	create_at ,
	    	id_expediente ,
	    	id_inventario ,
	    	id_responsable ,
	    	nro_expediente ,
	   	 	cod_paquete 
		
    ) VALUES (
        CURRENT_TIMESTAMP,    -- Fecha de la transacción actual
        'U',                  -- Indicador de transacción (U para update)
        NEW.c_aud_uidred,        -- Usuario que hizo la modificación (nuevos datos)
        NEW.c_aud_pc,         -- PC (nuevos datos)
        NEW.c_aud_ip,         -- IP (nuevos datos)
        NEW.c_aud_mac,        -- MAC (nuevos datos)

		OLD.f_aud,            -- Fecha de auditoría antes de la modificación
        OLD.b_aud,            -- Indicador de auditoría antes de la modificación
        OLD.c_aud_uid,        -- UID de auditoría anterior
        OLD.c_aud_uidred,     -- UID de red anterior
        OLD.c_aud_pc,         -- PC anterior
        OLD.c_aud_ip,         -- IP anterior
        OLD.c_aud_mac,         -- MAC anterior
		
			OLD.create_at ,
	    	OLD.id_expediente ,
	    	OLD.id_inventario ,
	    	OLD.id_responsable ,
	    	OLD.nro_expediente ,
	   	 	OLD.cod_paquete 
    );

    -- Continuar con la operación de actualización
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER utg_t_expediente_upd
AFTER UPDATE ON archivo.t_expediente
FOR EACH ROW
EXECUTE FUNCTION archivo.ufn_auditar_t_expediente_upd();

CREATE OR REPLACE FUNCTION archivo.ufn_auditar_t_expediente_del()
RETURNS TRIGGER AS $$
BEGIN
  -- Insertar en la tabla de auditoría los datos antes de la eliminación
  INSERT INTO auditoria.aud_t_expediente (
      f_trns, 
	  b_trns, 
	  c_trns_uidred, 
	  c_trns_pc, 
	  c_trns_ip, 
	  c_trns_mac,

	  f_aud, 
	  b_aud, 
	  c_aud_uid, 
	  c_aud_uidred, 
	  c_aud_pc, 
	  c_aud_ip, 
	  c_aud_mac,
	  
	  	  	create_at ,
	    	id_expediente ,
	    	id_inventario ,
	    	id_responsable ,
	    	nro_expediente ,
	   	 	cod_paquete 
  )
  VALUES (
    CURRENT_TIMESTAMP, -- Fecha y hora de la transacción
	'D',
	COALESCE(current_setting('myapp.c_trns_uidred', true), current_user), -- Parámetro de sesión para c_trns_uidred
    current_setting('myapp.c_trns_pc', true), -- Parámetro de sesión para c_trns_pc
    COALESCE(current_setting('myapp.c_trns_ip', true), '172.0.0.1'), -- Parámetro de sesión para c_trns_ip
    current_setting('myapp.c_trns_mac', true), -- Parámetro de sesión para c_trns_mac

	OLD.f_aud, 
	OLD.b_aud, 
	OLD.c_aud_uid, 
	OLD.c_aud_uidred, 
	OLD.c_aud_pc, 
	OLD.c_aud_ip, 
	OLD.c_aud_mac,
	
       	  	OLD.create_at ,
	    	OLD.id_expediente ,
	    	OLD.id_inventario ,
	    	OLD.id_responsable ,
	    	OLD.nro_expediente ,
	   	 	OLD.cod_paquete    
  );

  RETURN OLD; -- Devolver OLD en un trigger antes de eliminar
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER utg_t_expediente_del
BEFORE DELETE ON archivo.t_expediente
FOR EACH ROW
EXECUTE FUNCTION archivo.ufn_auditar_t_expediente_del();


-------------------------------------------------------------------------------------------------------
-- 3.- PREPARACION 
-------------------------------------------------------------------------------------------------------
CREATE TABLE auditoria.aud_t_preparacion (
    n_trns_id SERIAL PRIMARY KEY,
	
    f_trns TIMESTAMP,
    b_trns CHAR(1),
    c_trns_uidred VARCHAR(30),
    c_trns_pc VARCHAR(30),
    c_trns_ip VARCHAR(15),
    c_trns_mac VARCHAR(17),

    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),


			create_at timestamp,
		    id_preparacion integer,
		    id_expediente integer,
		    id_responsable integer,
		    fojas_total integer,
		    fojas_unacara integer,
		    fojas_doscaras integer,
		    observaciones varchar,
		    copias_originales boolean,
		    copias_simples boolean

);

-- TRIGGER PREPARACION
CREATE OR REPLACE FUNCTION archivo.ufn_auditar_t_preparacion_upd() 
RETURNS TRIGGER AS $$
BEGIN
    -- Insertar los datos antes de la modificación en la tabla de auditoría
    INSERT INTO auditoria.aud_t_preparacion (
        f_trns,               -- Fecha de la transacción
        b_trns,               -- Indicador de transacción ('U' para update)
        c_trns_uidred,        -- Usuario que hizo la modificación
        c_trns_pc,            -- PC
        c_trns_ip,            -- IP
        c_trns_mac,           -- MAC

		f_aud,                -- Fecha de auditoría anterior
        b_aud,                -- Indicador de auditoría anterior
        c_aud_uid,            -- UID de auditoría anterior
        c_aud_uidred,         -- UID de red anterior
        c_aud_pc,             -- PC anterior
        c_aud_ip,             -- IP anterior
        c_aud_mac,             -- MAC anterior

			create_at,
		    id_preparacion,
		    id_expediente,
		    id_responsable,
		    fojas_total,
		    fojas_unacara,
		    fojas_doscaras,
		    observaciones,
		    copias_originales,
		    copias_simples
		
    ) VALUES (
        CURRENT_TIMESTAMP,    -- Fecha de la transacción actual
        'U',                  -- Indicador de transacción (U para update)
        NEW.c_aud_uidred,        -- Usuario que hizo la modificación (nuevos datos)
        NEW.c_aud_pc,         -- PC (nuevos datos)
        NEW.c_aud_ip,         -- IP (nuevos datos)
        NEW.c_aud_mac,        -- MAC (nuevos datos)

		OLD.f_aud,            -- Fecha de auditoría antes de la modificación
        OLD.b_aud,            -- Indicador de auditoría antes de la modificación
        OLD.c_aud_uid,        -- UID de auditoría anterior
        OLD.c_aud_uidred,     -- UID de red anterior
        OLD.c_aud_pc,         -- PC anterior
        OLD.c_aud_ip,         -- IP anterior
        OLD.c_aud_mac,         -- MAC anterior
		
				OLD.create_at,
			    OLD.id_preparacion,
			    OLD.id_expediente,
			    OLD.id_responsable,
			    OLD.fojas_total,
			    OLD.fojas_unacara,
			    OLD.fojas_doscaras,
			    OLD.observaciones,
			    OLD.copias_originales,
			    OLD.copias_simples
    );

    -- Continuar con la operación de actualización
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER utg_t_preparacion_upd
AFTER UPDATE ON archivo.t_preparacion
FOR EACH ROW
EXECUTE FUNCTION archivo.ufn_auditar_t_preparacion_upd();

CREATE OR REPLACE FUNCTION archivo.ufn_auditar_t_preparacion_del()
RETURNS TRIGGER AS $$
BEGIN
  -- Insertar en la tabla de auditoría los datos antes de la eliminación
  INSERT INTO auditoria.aud_t_preparacion (
      f_trns, 
	  b_trns, 
	  c_trns_uidred, 
	  c_trns_pc, 
	  c_trns_ip, 
	  c_trns_mac,

	  f_aud, 
	  b_aud, 
	  c_aud_uid, 
	  c_aud_uidred, 
	  c_aud_pc, 
	  c_aud_ip, 
	  c_aud_mac,

	  		create_at,
		    id_preparacion,
		    id_expediente,
		    id_responsable,
		    fojas_total,
		    fojas_unacara,
		    fojas_doscaras,
		    observaciones,
		    copias_originales,
		    copias_simples
  )
  VALUES (
    CURRENT_TIMESTAMP, -- Fecha y hora de la transacción
	'D',
	COALESCE(current_setting('myapp.c_trns_uidred', true), current_user), -- Parámetro de sesión para c_trns_uidred
    current_setting('myapp.c_trns_pc', true), -- Parámetro de sesión para c_trns_pc
    COALESCE(current_setting('myapp.c_trns_ip', true), '172.0.0.1'), -- Parámetro de sesión para c_trns_ip
    current_setting('myapp.c_trns_mac', true), -- Parámetro de sesión para c_trns_mac

	OLD.f_aud, 
	OLD.b_aud, 
	OLD.c_aud_uid, 
	OLD.c_aud_uidred, 
	OLD.c_aud_pc, 
	OLD.c_aud_ip, 
	OLD.c_aud_mac,

				OLD.create_at,
			    OLD.id_preparacion,
			    OLD.id_expediente,
			    OLD.id_responsable,
			    OLD.fojas_total,
			    OLD.fojas_unacara,
			    OLD.fojas_doscaras,
			    OLD.observaciones,
			    OLD.copias_originales,
			    OLD.copias_simples    
  );

  RETURN OLD; -- Devolver OLD en un trigger antes de eliminar
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER utg_t_preparacion_del
BEFORE DELETE ON archivo.t_preparacion
FOR EACH ROW
EXECUTE FUNCTION archivo.ufn_auditar_t_preparacion_del();


-------------------------------------------------------------------------------------------------------
-- 4.- DIGITALIZACION 
-------------------------------------------------------------------------------------------------------
CREATE TABLE auditoria.aud_t_digitalizacion (
    n_trns_id SERIAL PRIMARY KEY,
	
    f_trns TIMESTAMP,
    b_trns CHAR(1),
    c_trns_uidred VARCHAR(30),
    c_trns_pc VARCHAR(30),
    c_trns_ip VARCHAR(15),
    c_trns_mac VARCHAR(17),

    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),

			create_at timestamp,
		    id_digitalizacion integer,
		    id_expediente integer,
		    id_responsable integer,
		    fojas_total integer,
		    ocr boolean,
		    escala_gris boolean,
		    color boolean,
		    observaciones varchar,
		    dir_ftp varchar,
		    hash_doc varchar,
		    peso_doc integer

);

-- TRIGGER DIGITALIZACION
CREATE OR REPLACE FUNCTION archivo.ufn_auditar_t_digitalizacion_upd() 
RETURNS TRIGGER AS $$
BEGIN
    -- Insertar los datos antes de la modificación en la tabla de auditoría
    INSERT INTO auditoria.aud_t_digitalizacion (
        f_trns,               -- Fecha de la transacción
        b_trns,               -- Indicador de transacción ('U' para update)
        c_trns_uidred,        -- Usuario que hizo la modificación
        c_trns_pc,            -- PC
        c_trns_ip,            -- IP
        c_trns_mac,           -- MAC

		f_aud,                -- Fecha de auditoría anterior
        b_aud,                -- Indicador de auditoría anterior
        c_aud_uid,            -- UID de auditoría anterior
        c_aud_uidred,         -- UID de red anterior
        c_aud_pc,             -- PC anterior
        c_aud_ip,             -- IP anterior
        c_aud_mac,             -- MAC anterior

				create_at,
			    id_digitalizacion,
			    id_expediente,
			    id_responsable,
			    fojas_total,
			    ocr,
			    escala_gris,
			    color,
			    observaciones,
			    dir_ftp,
			    hash_doc,
			    peso_doc
		
    ) VALUES (
        CURRENT_TIMESTAMP,    -- Fecha de la transacción actual
        'U',                  -- Indicador de transacción (U para update)
        NEW.c_aud_uidred,        -- Usuario que hizo la modificación (nuevos datos)
        NEW.c_aud_pc,         -- PC (nuevos datos)
        NEW.c_aud_ip,         -- IP (nuevos datos)
        NEW.c_aud_mac,        -- MAC (nuevos datos)

		OLD.f_aud,            -- Fecha de auditoría antes de la modificación
        OLD.b_aud,            -- Indicador de auditoría antes de la modificación
        OLD.c_aud_uid,        -- UID de auditoría anterior
        OLD.c_aud_uidred,     -- UID de red anterior
        OLD.c_aud_pc,         -- PC anterior
        OLD.c_aud_ip,         -- IP anterior
        OLD.c_aud_mac,         -- MAC anterior

				OLD.create_at,
			    OLD.id_digitalizacion,
			    OLD.id_expediente,
			    OLD.id_responsable,
			    OLD.fojas_total,
			    OLD.ocr,
			    OLD.escala_gris,
			    OLD.color,
			    OLD.observaciones,
			    OLD.dir_ftp,
			    OLD.hash_doc,
			    OLD.peso_doc

    );

    -- Continuar con la operación de actualización
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER utg_t_digitalizacion_upd
AFTER UPDATE ON archivo.t_digitalizacion
FOR EACH ROW
EXECUTE FUNCTION archivo.ufn_auditar_t_digitalizacion_upd();

CREATE OR REPLACE FUNCTION archivo.ufn_auditar_t_digitalizacion_del()
RETURNS TRIGGER AS $$
BEGIN
  -- Insertar en la tabla de auditoría los datos antes de la eliminación
  INSERT INTO auditoria.aud_t_digitalizacion (
      f_trns, 
	  b_trns, 
	  c_trns_uidred, 
	  c_trns_pc, 
	  c_trns_ip, 
	  c_trns_mac,

	  f_aud, 
	  b_aud, 
	  c_aud_uid, 
	  c_aud_uidred, 
	  c_aud_pc, 
	  c_aud_ip, 
	  c_aud_mac,

				create_at,
			    id_digitalizacion,
			    id_expediente,
			    id_responsable,
			    fojas_total,
			    ocr,
			    escala_gris,
			    color,
			    observaciones,
			    dir_ftp,
			    hash_doc,
			    peso_doc
  )
  VALUES (
    CURRENT_TIMESTAMP, -- Fecha y hora de la transacción
	'D',
	COALESCE(current_setting('myapp.c_trns_uidred', true), current_user), -- Parámetro de sesión para c_trns_uidred
    current_setting('myapp.c_trns_pc', true), -- Parámetro de sesión para c_trns_pc
    COALESCE(current_setting('myapp.c_trns_ip', true), '172.0.0.1'), -- Parámetro de sesión para c_trns_ip
    current_setting('myapp.c_trns_mac', true), -- Parámetro de sesión para c_trns_mac

	OLD.f_aud, 
	OLD.b_aud, 
	OLD.c_aud_uid, 
	OLD.c_aud_uidred, 
	OLD.c_aud_pc, 
	OLD.c_aud_ip, 
	OLD.c_aud_mac,

			OLD.create_at,
			OLD.id_digitalizacion,
			OLD.id_expediente,
			OLD.id_responsable,
			OLD.fojas_total,
			OLD.ocr,
			OLD.escala_gris,
			OLD.color,
			OLD.observaciones,
			OLD.dir_ftp,
			OLD.hash_doc,
			OLD.peso_doc
   
  );

  RETURN OLD; -- Devolver OLD en un trigger antes de eliminar
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER utg_t_digitalizacion_del
BEFORE DELETE ON archivo.t_digitalizacion
FOR EACH ROW
EXECUTE FUNCTION archivo.ufn_auditar_t_digitalizacion_del();


-------------------------------------------------------------------------------------------------------
-- 5.- INDIZACION  
-------------------------------------------------------------------------------------------------------
CREATE TABLE auditoria.aud_t_indizacion (
    n_trns_id SERIAL PRIMARY KEY,
	
    f_trns TIMESTAMP,
    b_trns CHAR(1),
    c_trns_uidred VARCHAR(30),
    c_trns_pc VARCHAR(30),
    c_trns_ip VARCHAR(15),
    c_trns_mac VARCHAR(17),

    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),

				create_at timestamp,
			    id_indizacion integer,
			    id_expediente integer,
			    id_responsable integer,
			    indice varchar,
			    observaciones varchar,
			    juzgado_origen varchar,
			    tipo_proceso varchar,
			    materia varchar,
			    demandante varchar,
			    demandado varchar,
			    fecha_inicial date,
			    fecha_final date

);

-- TRIGGER DIGITALIZACION
CREATE OR REPLACE FUNCTION archivo.ufn_auditar_t_indizacion_upd() 
RETURNS TRIGGER AS $$
BEGIN
    -- Insertar los datos antes de la modificación en la tabla de auditoría
    INSERT INTO auditoria.aud_t_indizacion (
        f_trns,               -- Fecha de la transacción
        b_trns,               -- Indicador de transacción ('U' para update)
        c_trns_uidred,        -- Usuario que hizo la modificación
        c_trns_pc,            -- PC
        c_trns_ip,            -- IP
        c_trns_mac,           -- MAC

		f_aud,                -- Fecha de auditoría anterior
        b_aud,                -- Indicador de auditoría anterior
        c_aud_uid,            -- UID de auditoría anterior
        c_aud_uidred,         -- UID de red anterior
        c_aud_pc,             -- PC anterior
        c_aud_ip,             -- IP anterior
        c_aud_mac,             -- MAC anterior

				create_at,
			    id_indizacion,
			    id_expediente,
			    id_responsable,
			    indice,
			    observaciones,
			    juzgado_origen,
			    tipo_proceso,
			    materia,
			    demandante,
			    demandado,
			    fecha_inicial,
			    fecha_final

		
    ) VALUES (
        CURRENT_TIMESTAMP,    -- Fecha de la transacción actual
        'U',                  -- Indicador de transacción (U para update)
        NEW.c_aud_uidred,        -- Usuario que hizo la modificación (nuevos datos)
        NEW.c_aud_pc,         -- PC (nuevos datos)
        NEW.c_aud_ip,         -- IP (nuevos datos)
        NEW.c_aud_mac,        -- MAC (nuevos datos)

		OLD.f_aud,            -- Fecha de auditoría antes de la modificación
        OLD.b_aud,            -- Indicador de auditoría antes de la modificación
        OLD.c_aud_uid,        -- UID de auditoría anterior
        OLD.c_aud_uidred,     -- UID de red anterior
        OLD.c_aud_pc,         -- PC anterior
        OLD.c_aud_ip,         -- IP anterior
        OLD.c_aud_mac,         -- MAC anterior

				OLD.create_at,
			    OLD.id_indizacion,
			    OLD.id_expediente,
			    OLD.id_responsable,
			    OLD.indice,
			    OLD.observaciones,
			    OLD.juzgado_origen,
			    OLD.tipo_proceso,
			    OLD.materia,
			    OLD.demandante,
			    OLD.demandado,
			    OLD.fecha_inicial,
			    OLD.fecha_final

    );

    -- Continuar con la operación de actualización
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER utg_t_indizacion_upd
AFTER UPDATE ON archivo.t_indizacion
FOR EACH ROW
EXECUTE FUNCTION archivo.ufn_auditar_t_indizacion_upd();

CREATE OR REPLACE FUNCTION archivo.ufn_auditar_t_indizacion_del()
RETURNS TRIGGER AS $$
BEGIN
  -- Insertar en la tabla de auditoría los datos antes de la eliminación
  INSERT INTO auditoria.aud_t_indizacion (
      f_trns, 
	  b_trns, 
	  c_trns_uidred, 
	  c_trns_pc, 
	  c_trns_ip, 
	  c_trns_mac,

	  f_aud, 
	  b_aud, 
	  c_aud_uid, 
	  c_aud_uidred, 
	  c_aud_pc, 
	  c_aud_ip, 
	  c_aud_mac,

	  			create_at,
			    id_indizacion,
			    id_expediente,
			    id_responsable,
			    indice,
			    observaciones,
			    juzgado_origen,
			    tipo_proceso,
			    materia,
			    demandante,
			    demandado,
			    fecha_inicial,
			    fecha_final

  )
  VALUES (
    CURRENT_TIMESTAMP, -- Fecha y hora de la transacción
	'D',
	COALESCE(current_setting('myapp.c_trns_uidred', true), current_user), -- Parámetro de sesión para c_trns_uidred
    current_setting('myapp.c_trns_pc', true), -- Parámetro de sesión para c_trns_pc
    COALESCE(current_setting('myapp.c_trns_ip', true), '172.0.0.1'), -- Parámetro de sesión para c_trns_ip
    current_setting('myapp.c_trns_mac', true), -- Parámetro de sesión para c_trns_mac

	OLD.f_aud, 
	OLD.b_aud, 
	OLD.c_aud_uid, 
	OLD.c_aud_uidred, 
	OLD.c_aud_pc, 
	OLD.c_aud_ip, 
	OLD.c_aud_mac,

				OLD.create_at,
			    OLD.id_indizacion,
			    OLD.id_expediente,
			    OLD.id_responsable,
			    OLD.indice,
			    OLD.observaciones,
			    OLD.juzgado_origen,
			    OLD.tipo_proceso,
			    OLD.materia,
			    OLD.demandante,
			    OLD.demandado,
			    OLD.fecha_inicial,
			    OLD.fecha_final

  );

  RETURN OLD; -- Devolver OLD en un trigger antes de eliminar
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER utg_t_indizacion_del
BEFORE DELETE ON archivo.t_indizacion
FOR EACH ROW
EXECUTE FUNCTION archivo.ufn_auditar_t_indizacion_del();

-------------------------------------------------------------------------------------------------------
-- 6.- CONTROL DE CALIDAD 
-------------------------------------------------------------------------------------------------------
CREATE TABLE auditoria.aud_t_control (
    n_trns_id SERIAL PRIMARY KEY,
	
    f_trns TIMESTAMP,
    b_trns CHAR(1),
    c_trns_uidred VARCHAR(30),
    c_trns_pc VARCHAR(30),
    c_trns_ip VARCHAR(15),
    c_trns_mac VARCHAR(17),

    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),

				create_at timestamp,
			    id_control integer,
			    id_expediente integer,
			    id_responsable integer,
			    observaciones varchar,
			    val_observaciones boolean,
			    val_datos boolean,
			    val_nitidez boolean,
			    val_pruebas_impresion boolean,
			    val_copia_fiel boolean

);

-- TRIGGER DIGITALIZACION
CREATE OR REPLACE FUNCTION archivo.ufn_auditar_t_control_upd() 
RETURNS TRIGGER AS $$
BEGIN
    -- Insertar los datos antes de la modificación en la tabla de auditoría
    INSERT INTO auditoria.aud_t_control (
        f_trns,               -- Fecha de la transacción
        b_trns,               -- Indicador de transacción ('U' para update)
        c_trns_uidred,        -- Usuario que hizo la modificación
        c_trns_pc,            -- PC
        c_trns_ip,            -- IP
        c_trns_mac,           -- MAC

		f_aud,                -- Fecha de auditoría anterior
        b_aud,                -- Indicador de auditoría anterior
        c_aud_uid,            -- UID de auditoría anterior
        c_aud_uidred,         -- UID de red anterior
        c_aud_pc,             -- PC anterior
        c_aud_ip,             -- IP anterior
        c_aud_mac,             -- MAC anterior

				create_at,
			    id_control,
			    id_expediente,
			    id_responsable,
			    observaciones,
			    val_observaciones,
			    val_datos,
			    val_nitidez,
			    val_pruebas_impresion,
			    val_copia_fiel

		
    ) VALUES (
        CURRENT_TIMESTAMP,    -- Fecha de la transacción actual
        'U',                  -- Indicador de transacción (U para update)
        NEW.c_aud_uidred,        -- Usuario que hizo la modificación (nuevos datos)
        NEW.c_aud_pc,         -- PC (nuevos datos)
        NEW.c_aud_ip,         -- IP (nuevos datos)
        NEW.c_aud_mac,        -- MAC (nuevos datos)

		OLD.f_aud,            -- Fecha de auditoría antes de la modificación
        OLD.b_aud,            -- Indicador de auditoría antes de la modificación
        OLD.c_aud_uid,        -- UID de auditoría anterior
        OLD.c_aud_uidred,     -- UID de red anterior
        OLD.c_aud_pc,         -- PC anterior
        OLD.c_aud_ip,         -- IP anterior
        OLD.c_aud_mac,         -- MAC anterior

				OLD.create_at,
			    OLD.id_control,
			    OLD.id_expediente,
			    OLD.id_responsable,
			    OLD.observaciones,
			    OLD.val_observaciones,
			    OLD.val_datos,
			    OLD.val_nitidez,
			    OLD.val_pruebas_impresion,
			    OLD.val_copia_fiel

    );

    -- Continuar con la operación de actualización
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER utg_t_control_upd
AFTER UPDATE ON archivo.t_control
FOR EACH ROW
EXECUTE FUNCTION archivo.ufn_auditar_t_control_upd();

CREATE OR REPLACE FUNCTION archivo.ufn_auditar_t_control_del()
RETURNS TRIGGER AS $$
BEGIN
  -- Insertar en la tabla de auditoría los datos antes de la eliminación
  INSERT INTO auditoria.aud_t_control (
      f_trns, 
	  b_trns, 
	  c_trns_uidred, 
	  c_trns_pc, 
	  c_trns_ip, 
	  c_trns_mac,

	  f_aud, 
	  b_aud, 
	  c_aud_uid, 
	  c_aud_uidred, 
	  c_aud_pc, 
	  c_aud_ip, 
	  c_aud_mac,

				create_at,
			    id_control,
			    id_expediente,
			    id_responsable,
			    observaciones,
			    val_observaciones,
			    val_datos,
			    val_nitidez,
			    val_pruebas_impresion,
			    val_copia_fiel

  )
  VALUES (
    CURRENT_TIMESTAMP, -- Fecha y hora de la transacción
	'D',
	COALESCE(current_setting('myapp.c_trns_uidred', true), current_user), -- Parámetro de sesión para c_trns_uidred
    current_setting('myapp.c_trns_pc', true), -- Parámetro de sesión para c_trns_pc
    COALESCE(current_setting('myapp.c_trns_ip', true), '172.0.0.1'), -- Parámetro de sesión para c_trns_ip
    current_setting('myapp.c_trns_mac', true), -- Parámetro de sesión para c_trns_mac

	OLD.f_aud, 
	OLD.b_aud, 
	OLD.c_aud_uid, 
	OLD.c_aud_uidred, 
	OLD.c_aud_pc, 
	OLD.c_aud_ip, 
	OLD.c_aud_mac,

				OLD.create_at,
			    OLD.id_control,
			    OLD.id_expediente,
			    OLD.id_responsable,
			    OLD.observaciones,
			    OLD.val_observaciones,
			    OLD.val_datos,
			    OLD.val_nitidez,
			    OLD.val_pruebas_impresion,
			    OLD.val_copia_fiel

  );

  RETURN OLD; -- Devolver OLD en un trigger antes de eliminar
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER utg_t_control_del
BEFORE DELETE ON archivo.t_control
FOR EACH ROW
EXECUTE FUNCTION archivo.ufn_auditar_t_control_del();


-------------------------------------------------------------------------------------------------------
-- 7.- FEDATARIO
-------------------------------------------------------------------------------------------------------
CREATE TABLE auditoria.aud_t_fedatar (
    n_trns_id SERIAL PRIMARY KEY,
	
    f_trns TIMESTAMP,
    b_trns CHAR(1),
    c_trns_uidred VARCHAR(30),
    c_trns_pc VARCHAR(30),
    c_trns_ip VARCHAR(15),
    c_trns_mac VARCHAR(17),

    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),

			create_at timestamp,
		    id_fedatar integer,
		    id_expediente integer,
		    id_responsable integer,
		    observaciones varchar


);

-- TRIGGER FEDATARIO
CREATE OR REPLACE FUNCTION archivo.ufn_auditar_t_fedatar_upd() 
RETURNS TRIGGER AS $$
BEGIN
    -- Insertar los datos antes de la modificación en la tabla de auditoría
    INSERT INTO auditoria.aud_t_fedatar (
        f_trns,               -- Fecha de la transacción
        b_trns,               -- Indicador de transacción ('U' para update)
        c_trns_uidred,        -- Usuario que hizo la modificación
        c_trns_pc,            -- PC
        c_trns_ip,            -- IP
        c_trns_mac,           -- MAC

		f_aud,                -- Fecha de auditoría anterior
        b_aud,                -- Indicador de auditoría anterior
        c_aud_uid,            -- UID de auditoría anterior
        c_aud_uidred,         -- UID de red anterior
        c_aud_pc,             -- PC anterior
        c_aud_ip,             -- IP anterior
        c_aud_mac,             -- MAC anterior


				create_at ,
			    id_fedatar ,
			    id_expediente ,
			    id_responsable ,
			    observaciones 

		
    ) VALUES (
        CURRENT_TIMESTAMP,    -- Fecha de la transacción actual
        'U',                  -- Indicador de transacción (U para update)
        NEW.c_aud_uidred,        -- Usuario que hizo la modificación (nuevos datos)
        NEW.c_aud_pc,         -- PC (nuevos datos)
        NEW.c_aud_ip,         -- IP (nuevos datos)
        NEW.c_aud_mac,        -- MAC (nuevos datos)

		OLD.f_aud,            -- Fecha de auditoría antes de la modificación
        OLD.b_aud,            -- Indicador de auditoría antes de la modificación
        OLD.c_aud_uid,        -- UID de auditoría anterior
        OLD.c_aud_uidred,     -- UID de red anterior
        OLD.c_aud_pc,         -- PC anterior
        OLD.c_aud_ip,         -- IP anterior
        OLD.c_aud_mac,         -- MAC anterior

				OLD.create_at ,
			    OLD.id_fedatar ,
			    OLD.id_expediente ,
			    OLD.id_responsable ,
			    OLD.observaciones 

    );

    -- Continuar con la operación de actualización
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER utg_t_fedatar_upd
AFTER UPDATE ON archivo.t_fedatar
FOR EACH ROW
EXECUTE FUNCTION archivo.ufn_auditar_t_fedatar_upd();

CREATE OR REPLACE FUNCTION archivo.ufn_auditar_t_fedatar_del()
RETURNS TRIGGER AS $$
BEGIN
  -- Insertar en la tabla de auditoría los datos antes de la eliminación
  INSERT INTO auditoria.aud_t_fedatar (
      f_trns, 
	  b_trns, 
	  c_trns_uidred, 
	  c_trns_pc, 
	  c_trns_ip, 
	  c_trns_mac,

	  f_aud, 
	  b_aud, 
	  c_aud_uid, 
	  c_aud_uidred, 
	  c_aud_pc, 
	  c_aud_ip, 
	  c_aud_mac,

	  			create_at ,
			    id_fedatar ,
			    id_expediente ,
			    id_responsable ,
			    observaciones 

  )
  VALUES (
    CURRENT_TIMESTAMP, -- Fecha y hora de la transacción
	'D',
	COALESCE(current_setting('myapp.c_trns_uidred', true), current_user), -- Parámetro de sesión para c_trns_uidred
    current_setting('myapp.c_trns_pc', true), -- Parámetro de sesión para c_trns_pc
    COALESCE(current_setting('myapp.c_trns_ip', true), '172.0.0.1'), -- Parámetro de sesión para c_trns_ip
    current_setting('myapp.c_trns_mac', true), -- Parámetro de sesión para c_trns_mac

	OLD.f_aud, 
	OLD.b_aud, 
	OLD.c_aud_uid, 
	OLD.c_aud_uidred, 
	OLD.c_aud_pc, 
	OLD.c_aud_ip, 
	OLD.c_aud_mac,


				OLD.create_at ,
			    OLD.id_fedatar ,
			    OLD.id_expediente ,
			    OLD.id_responsable ,
			    OLD.observaciones 
  );

  RETURN OLD; -- Devolver OLD en un trigger antes de eliminar
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER utg_t_fedatar_del
BEFORE DELETE ON archivo.t_fedatar
FOR EACH ROW
EXECUTE FUNCTION archivo.ufn_auditar_t_fedatar_del();


-------------------------------------------------------------------------------------------------------
-- 8.- USUARIO
-------------------------------------------------------------------------------------------------------
CREATE TABLE auditoria.aud_t_usuario (
    n_trns_id SERIAL PRIMARY KEY,
	
    f_trns TIMESTAMP,
    b_trns CHAR(1),
    c_trns_uidred VARCHAR(30),
    c_trns_pc VARCHAR(30),
    c_trns_ip VARCHAR(15),
    c_trns_mac VARCHAR(17),

    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),

			create_at timestamp,
		    id_usuario integer,
		    id_persona integer,
		    perfil varchar,
		    username varchar ,
		    password varchar,
		    estado boolean,
		    intentos_login integer
			
);

-- TRIGGER USUARIO
CREATE OR REPLACE FUNCTION archivo.ufn_auditar_t_usuario_upd() 
RETURNS TRIGGER AS $$
BEGIN
    -- Insertar los datos antes de la modificación en la tabla de auditoría
    INSERT INTO auditoria.aud_t_usuario (
        f_trns,               -- Fecha de la transacción
        b_trns,               -- Indicador de transacción ('U' para update)
        c_trns_uidred,        -- Usuario que hizo la modificación
        c_trns_pc,            -- PC
        c_trns_ip,            -- IP
        c_trns_mac,           -- MAC

		f_aud,                -- Fecha de auditoría anterior
        b_aud,                -- Indicador de auditoría anterior
        c_aud_uid,            -- UID de auditoría anterior
        c_aud_uidred,         -- UID de red anterior
        c_aud_pc,             -- PC anterior
        c_aud_ip,             -- IP anterior
        c_aud_mac,             -- MAC anterior

				create_at,
			    id_usuario,
			    id_persona,
			    perfil,
			    username,
			    password,
			    estado,
			    intentos_login

		
    ) VALUES (
        CURRENT_TIMESTAMP,    -- Fecha de la transacción actual
        'U',                  -- Indicador de transacción (U para update)
        NEW.c_aud_uidred,     -- Usuario que hizo la modificación (nuevos datos)
        NEW.c_aud_pc,         -- PC (nuevos datos)
        NEW.c_aud_ip,         -- IP (nuevos datos)
        NEW.c_aud_mac,        -- MAC (nuevos datos)

		OLD.f_aud,            -- Fecha de auditoría antes de la modificación
        OLD.b_aud,            -- Indicador de auditoría antes de la modificación
        OLD.c_aud_uid,        -- UID de auditoría anterior
        OLD.c_aud_uidred,     -- UID de red anterior
        OLD.c_aud_pc,         -- PC anterior
        OLD.c_aud_ip,         -- IP anterior
        OLD.c_aud_mac,         -- MAC anterior

				OLD.create_at,
			    OLD.id_usuario,
			    OLD.id_persona,
			    OLD.perfil ,
			    OLD.username,
			    OLD.password,
			    OLD.estado,
			    OLD.intentos_login

    );

    -- Continuar con la operación de actualización
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER utg_t_usuario_upd
AFTER UPDATE ON archivo.t_usuario
FOR EACH ROW
WHEN (
    OLD.username IS DISTINCT FROM NEW.username OR
    OLD.password IS DISTINCT FROM NEW.password OR
    OLD.perfil   IS DISTINCT FROM NEW.perfil OR
    OLD.estado   IS DISTINCT FROM NEW.estado
)
EXECUTE FUNCTION archivo.ufn_auditar_t_usuario_upd();

CREATE OR REPLACE FUNCTION archivo.ufn_auditar_t_usuario_del()
RETURNS TRIGGER AS $$
BEGIN
  -- Insertar en la tabla de auditoría los datos antes de la eliminación
  INSERT INTO auditoria.aud_t_usuario (
      f_trns, 
	  b_trns, 
	  c_trns_uidred, 
	  c_trns_pc, 
	  c_trns_ip, 
	  c_trns_mac,

	  f_aud, 
	  b_aud, 
	  c_aud_uid, 
	  c_aud_uidred, 
	  c_aud_pc, 
	  c_aud_ip, 
	  c_aud_mac,

				create_at ,
			    id_usuario ,
			    id_persona ,
			    perfil ,
			    username ,
			    password,
			    estado,
			    intentos_login

  )
  VALUES (
    CURRENT_TIMESTAMP, -- Fecha y hora de la transacción
	'D',
	COALESCE(current_setting('myapp.c_trns_uidred', true), current_user), -- Parámetro de sesión para c_trns_uidred
    current_setting('myapp.c_trns_pc', true), -- Parámetro de sesión para c_trns_pc
    COALESCE(current_setting('myapp.c_trns_ip', true), '172.0.0.1'), -- Parámetro de sesión para c_trns_ip
    current_setting('myapp.c_trns_mac', true), -- Parámetro de sesión para c_trns_mac

	OLD.f_aud, 
	OLD.b_aud, 
	OLD.c_aud_uid, 
	OLD.c_aud_uidred, 
	OLD.c_aud_pc, 
	OLD.c_aud_ip, 
	OLD.c_aud_mac,

				OLD.create_at ,
			    OLD.id_usuario ,
			    OLD.id_persona ,
			    OLD.perfil ,
			    OLD.username  ,
			    OLD.password ,
			    OLD.estado ,
			    OLD.intentos_login

  );

  RETURN OLD; -- Devolver OLD en un trigger antes de eliminar
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER utg_t_usuario_del
BEFORE DELETE ON archivo.t_usuario
FOR EACH ROW
EXECUTE FUNCTION archivo.ufn_auditar_t_usuario_del();



-------------------------------------------------------------------------------------------------------
-- 9.- PERSONA
-------------------------------------------------------------------------------------------------------
CREATE TABLE auditoria.aud_t_persona (
    n_trns_id SERIAL PRIMARY KEY,
	
    f_trns TIMESTAMP,
    b_trns CHAR(1),
    c_trns_uidred VARCHAR(30),
    c_trns_pc VARCHAR(30),
    c_trns_ip VARCHAR(15),
    c_trns_mac VARCHAR(17),

    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),

			create_at timestamp,
		    id_persona integer,
		    nombre varchar,
		    ap_paterno varchar,
		    ap_materno varchar,
		    dni varchar
);

-- TRIGGER PERSONA
CREATE OR REPLACE FUNCTION archivo.ufn_auditar_t_persona_upd() 
RETURNS TRIGGER AS $$
BEGIN
    -- Insertar los datos antes de la modificación en la tabla de auditoría
    INSERT INTO auditoria.aud_t_persona (
        f_trns,               -- Fecha de la transacción
        b_trns,               -- Indicador de transacción ('U' para update)
        c_trns_uidred,        -- Usuario que hizo la modificación
        c_trns_pc,            -- PC
        c_trns_ip,            -- IP
        c_trns_mac,           -- MAC

		f_aud,                -- Fecha de auditoría anterior
        b_aud,                -- Indicador de auditoría anterior
        c_aud_uid,            -- UID de auditoría anterior
        c_aud_uidred,         -- UID de red anterior
        c_aud_pc,             -- PC anterior
        c_aud_ip,             -- IP anterior
        c_aud_mac,             -- MAC anterior

				create_at,
			    id_persona,
			    nombre,
			    ap_paterno,
			    ap_materno,
			    dni
		
    ) VALUES (
        CURRENT_TIMESTAMP,    -- Fecha de la transacción actual
        'U',                  -- Indicador de transacción (U para update)
        NEW.c_aud_uidred,        -- Usuario que hizo la modificación (nuevos datos)
        NEW.c_aud_pc,         -- PC (nuevos datos)
        NEW.c_aud_ip,         -- IP (nuevos datos)
        NEW.c_aud_mac,        -- MAC (nuevos datos)

		OLD.f_aud,            -- Fecha de auditoría antes de la modificación
        OLD.b_aud,            -- Indicador de auditoría antes de la modificación
        OLD.c_aud_uid,        -- UID de auditoría anterior
        OLD.c_aud_uidred,     -- UID de red anterior
        OLD.c_aud_pc,         -- PC anterior
        OLD.c_aud_ip,         -- IP anterior
        OLD.c_aud_mac,         -- MAC anterior

				OLD.create_at,
			    OLD.id_persona,
			    OLD.nombre,
			    OLD.ap_paterno,
			    OLD.ap_materno,
			    OLD.dni

    );

    -- Continuar con la operación de actualización
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER utg_t_persona_upd
AFTER UPDATE ON archivo.t_persona
FOR EACH ROW
EXECUTE FUNCTION archivo.ufn_auditar_t_persona_upd();

CREATE OR REPLACE FUNCTION archivo.ufn_auditar_t_persona_del()
RETURNS TRIGGER AS $$
BEGIN
  -- Insertar en la tabla de auditoría los datos antes de la eliminación
  INSERT INTO auditoria.aud_t_persona (
      f_trns, 
	  b_trns, 
	  c_trns_uidred, 
	  c_trns_pc, 
	  c_trns_ip, 
	  c_trns_mac,

	  f_aud, 
	  b_aud, 
	  c_aud_uid, 
	  c_aud_uidred, 
	  c_aud_pc, 
	  c_aud_ip, 
	  c_aud_mac,

				create_at,
			    id_persona,
			    nombre,
			    ap_paterno,
			    ap_materno,
			    dni

  )
  VALUES (
    CURRENT_TIMESTAMP, -- Fecha y hora de la transacción
	'D',
	COALESCE(current_setting('myapp.c_trns_uidred', true), current_user), -- Parámetro de sesión para c_trns_uidred
    current_setting('myapp.c_trns_pc', true), -- Parámetro de sesión para c_trns_pc
    COALESCE(current_setting('myapp.c_trns_ip', true), '172.0.0.1'), -- Parámetro de sesión para c_trns_ip
    current_setting('myapp.c_trns_mac', true), -- Parámetro de sesión para c_trns_mac

	OLD.f_aud, 
	OLD.b_aud, 
	OLD.c_aud_uid, 
	OLD.c_aud_uidred, 
	OLD.c_aud_pc, 
	OLD.c_aud_ip, 
	OLD.c_aud_mac,

			OLD.create_at,
			OLD.id_persona,
			OLD.nombre,
			OLD.ap_paterno,
			OLD.ap_materno,
			OLD.dni
  );

  RETURN OLD; -- Devolver OLD en un trigger antes de eliminar
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER utg_t_persona_del
BEFORE DELETE ON archivo.t_persona
FOR EACH ROW
EXECUTE FUNCTION archivo.ufn_auditar_t_persona_del();

-------------------------------------------------------------------------------------------------------
-- 10.- DISCO
-------------------------------------------------------------------------------------------------------
CREATE TABLE auditoria.aud_t_disco (
    n_trns_id SERIAL PRIMARY KEY,
	
    f_trns TIMESTAMP,
    b_trns CHAR(1),
    c_trns_uidred VARCHAR(30),
    c_trns_pc VARCHAR(30),
    c_trns_ip VARCHAR(15),
    c_trns_mac VARCHAR(17),

    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),

				create_at timestamp,
			    id_disco integer,
			    id_inventario integer,
			    id_responsable_crear integer,
			    nombre varchar,
			    volumen integer,
			    capacidad_gb integer,
			    espacio_ocupado numeric(5,2),
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
			    fecha_tarjeta_cierre timestamp,
			    id_responsable_tca integer,
			    id_responsable_tcc integer,
			    id_responsable_aa integer,
			    id_responsable_ac integer,
			    estado_cerrado boolean,
			    id_responsable_cierre integer
);

-- TRIGGER DISCO
CREATE OR REPLACE FUNCTION archivo.ufn_auditar_t_disco_upd() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO auditoria.aud_t_disco (
        f_trns, 
        b_trns, 
        c_trns_uidred, 
        c_trns_pc, 
        c_trns_ip, 
        c_trns_mac,

        f_aud, 
        b_aud, 
        c_aud_uid, 
        c_aud_uidred, 
        c_aud_pc, 
        c_aud_ip, 
        c_aud_mac,

        create_at,
        id_disco,
        id_inventario,
        id_responsable_crear,
        nombre,
        volumen,
        capacidad_gb,
        espacio_ocupado,
        dir_ftp_acta_apertura,
        dir_ftp_acta_cierre,
        dir_ftp_tarjeta_apertura,
        dir_ftp_tarjeta_cierre,
        peso_acta_apertura,
        peso_acta_cierre,
        peso_tarjeta_apertura,
        peso_tarjeta_cierre,
        fecha_acta_apertura,
        fecha_acta_cierre,
        fecha_tarjeta_apertura,
        fecha_tarjeta_cierre,
        id_responsable_tca,
        id_responsable_tcc,
        id_responsable_aa,
        id_responsable_ac,
        estado_cerrado,
        id_responsable_cierre
    ) 
    VALUES (
        CURRENT_TIMESTAMP,                       -- Fecha de la transacción actual
        'U',                                     -- Indicador de transacción
        COALESCE(current_setting('myapp.c_trns_uidred', true), SESSION_USER), -- Usuario que hizo la modificación
        current_setting('myapp.c_trns_pc', true), 
        COALESCE(current_settingcurrent_setting('myapp.c_trns_ip', true),'172.0.0.1'), 
        current_setting('myapp.c_trns_mac', true),

        OLD.f_aud, 
        OLD.b_aud, 
        OLD.c_aud_uid, 
        OLD.c_aud_uidred, 
        OLD.c_aud_pc, 
        OLD.c_aud_ip, 
        OLD.c_aud_mac,

        OLD.create_at,
        OLD.id_disco,
        OLD.id_inventario,
        OLD.id_responsable_crear,
        OLD.nombre,
        OLD.volumen,
        OLD.capacidad_gb,
        OLD.espacio_ocupado,
        OLD.dir_ftp_acta_apertura,
        OLD.dir_ftp_acta_cierre,
        OLD.dir_ftp_tarjeta_apertura,
        OLD.dir_ftp_tarjeta_cierre,
        OLD.peso_acta_apertura,
        OLD.peso_acta_cierre,
        OLD.peso_tarjeta_apertura,
        OLD.peso_tarjeta_cierre,
        OLD.fecha_acta_apertura,
        OLD.fecha_acta_cierre,
        OLD.fecha_tarjeta_apertura,
        OLD.fecha_tarjeta_cierre,
        OLD.id_responsable_tca,
        OLD.id_responsable_tcc,
        OLD.id_responsable_aa,
        OLD.id_responsable_ac,
        OLD.estado_cerrado,
        OLD.id_responsable_cierre
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER utg_t_disco_upd
AFTER UPDATE ON archivo.t_disco
FOR EACH ROW
EXECUTE FUNCTION archivo.ufn_auditar_t_disco_upd();


CREATE OR REPLACE FUNCTION archivo.ufn_auditar_t_disco_del()
RETURNS TRIGGER AS $$
BEGIN
  -- Insertar en la tabla de auditoría los datos antes de la eliminación
  INSERT INTO auditoria.aud_t_disco (
      f_trns, 
	  b_trns, 
	  c_trns_uidred, 
	  c_trns_pc, 
	  c_trns_ip, 
	  c_trns_mac,

	  f_aud, 
	  b_aud, 
	  c_aud_uid, 
	  c_aud_uidred, 
	  c_aud_pc, 
	  c_aud_ip, 
	  c_aud_mac,

				create_at,
			    id_disco,
			    id_inventario,
			    id_responsable_crear,
			    nombre,
			    volumen,
			    capacidad_gb,
			    espacio_ocupado,
			    dir_ftp_acta_apertura,
			    dir_ftp_acta_cierre,
			    dir_ftp_tarjeta_apertura,
			    dir_ftp_tarjeta_cierre,
			    peso_acta_apertura,
			    peso_acta_cierre,
			    peso_tarjeta_apertura,
			    peso_tarjeta_cierre,
			    fecha_acta_apertura,
			    fecha_acta_cierre,
			    fecha_tarjeta_apertura,
			    fecha_tarjeta_cierre,
			    id_responsable_tca,
			    id_responsable_tcc,
			    id_responsable_aa,
			    id_responsable_ac,
			    estado_cerrado,
			    id_responsable_cierre

  )
  VALUES (
    CURRENT_TIMESTAMP, -- Fecha y hora de la transacción
	'D',
	COALESCE(current_setting('myapp.c_trns_uidred', true), current_user), -- Parámetro de sesión para c_trns_uidred
    current_setting('myapp.c_trns_pc', true), -- Parámetro de sesión para c_trns_pc
    COALESCE(current_setting('myapp.c_trns_ip', true), '172.0.0.1'), -- Parámetro de sesión para c_trns_ip
    current_setting('myapp.c_trns_mac', true), -- Parámetro de sesión para c_trns_mac

	OLD.f_aud, 
	OLD.b_aud, 
	OLD.c_aud_uid, 
	OLD.c_aud_uidred, 
	OLD.c_aud_pc, 
	OLD.c_aud_ip, 
	OLD.c_aud_mac,

				OLD.create_at,
			    OLD.id_disco,
			    OLD.id_inventario,
			    OLD.id_responsable_crear,
			    OLD.nombre,
			    OLD.volumen,
			    OLD.capacidad_gb,
			    OLD.espacio_ocupado,
			    OLD.dir_ftp_acta_apertura,
			    OLD.dir_ftp_acta_cierre,
			    OLD.dir_ftp_tarjeta_apertura,
			    OLD.dir_ftp_tarjeta_cierre,
			    OLD.peso_acta_apertura,
			    OLD.peso_acta_cierre,
			    OLD.peso_tarjeta_apertura,
			    OLD.peso_tarjeta_cierre,
			    OLD.fecha_acta_apertura,
			    OLD.fecha_acta_cierre,
			    OLD.fecha_tarjeta_apertura,
			    OLD.fecha_tarjeta_cierre,
			    OLD.id_responsable_tca,
			    OLD.id_responsable_tcc,
			    OLD.id_responsable_aa,
			    OLD.id_responsable_ac,
			    OLD.estado_cerrado,
			    OLD.id_responsable_cierre
  );

  RETURN OLD; -- Devolver OLD en un trigger antes de eliminar
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER utg_t_disco_del
BEFORE DELETE ON archivo.t_disco
FOR EACH ROW
EXECUTE FUNCTION archivo.ufn_auditar_t_disco_del();

-------------------------------------------------------------------------------------------------------
-- 11.- ESTADO EXPEDIENTE
-------------------------------------------------------------------------------------------------------
CREATE TABLE auditoria.aud_t_estado_expediente (
    n_trns_id SERIAL PRIMARY KEY,
	
    f_trns TIMESTAMP,
    b_trns CHAR(1),
    c_trns_uidred VARCHAR(30),
    c_trns_pc VARCHAR(30),
    c_trns_ip VARCHAR(15),
    c_trns_mac VARCHAR(17),

    f_aud TIMESTAMP,
    b_aud CHAR(1),
    c_aud_uid VARCHAR(30),
    c_aud_uidred VARCHAR(30),
    c_aud_pc VARCHAR(30),
    c_aud_ip VARCHAR(15),
    c_aud_mac VARCHAR(17),

			create_at timestamp,
		    id_estado_expediente integer,
		    id_expediente integer,
		    estado_recepcionado char(1),
		    estado_preparado char(1),
		    estado_digitalizado char(1),
		    estado_indizado char(1),
		    estado_controlado char(1),
		    estado_fedatado char(1),
		    estado_finalizado char(1),
		    id_disco integer,
		    mensajes jsonb

);

-- TRIGGER ESTADO EXPEDIENTE
CREATE OR REPLACE FUNCTION archivo.ufn_auditar_t_estado_expediente_upd() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO auditoria.aud_t_estado_expediente (
        f_trns, 
        b_trns, 
        c_trns_uidred, 
        c_trns_pc, 
        c_trns_ip, 
        c_trns_mac,

        f_aud, 
        b_aud, 
        c_aud_uid, 
        c_aud_uidred, 
        c_aud_pc, 
        c_aud_ip, 
        c_aud_mac,

				create_at,
			    id_estado_expediente,
			    id_expediente,
			    estado_recepcionado,
			    estado_preparado,
			    estado_digitalizado,
			    estado_indizado,
			    estado_controlado,
			    estado_fedatado,
			    estado_finalizado,
			    id_disco,
			    mensajes

    ) 
    VALUES (
		CURRENT_TIMESTAMP,    -- Fecha de la transacción actual
        'U',                  -- Indicador de transacción (U para update)
        NEW.c_aud_uidred,        -- Usuario que hizo la modificación (nuevos datos)
        NEW.c_aud_pc,         -- PC (nuevos datos)
        NEW.c_aud_ip,         -- IP (nuevos datos)
        NEW.c_aud_mac,        -- MAC (nuevos datos)

        OLD.f_aud, 
        OLD.b_aud, 
        OLD.c_aud_uid, 
        OLD.c_aud_uidred, 
        OLD.c_aud_pc, 
        OLD.c_aud_ip, 
        OLD.c_aud_mac,

				OLD.create_at,
			    OLD.id_estado_expediente,
			    OLD.id_expediente,
			    OLD.estado_recepcionado,
			    OLD.estado_preparado,
			    OLD.estado_digitalizado,
			    OLD.estado_indizado,
			    OLD.estado_controlado,
			    OLD.estado_fedatado,
			    OLD.estado_finalizado,
			    OLD.id_disco,
			    OLD.mensajes			

    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER utg_t_estado_expediente_upd
AFTER UPDATE ON archivo.t_estado_expediente
FOR EACH ROW
EXECUTE FUNCTION archivo.ufn_auditar_t_estado_expediente_upd();


CREATE OR REPLACE FUNCTION archivo.ufn_auditar_t_estado_expediente_del()
RETURNS TRIGGER AS $$
BEGIN
  -- Insertar en la tabla de auditoría los datos antes de la eliminación
  INSERT INTO auditoria.aud_t_estado_expediente (
      f_trns, 
	  b_trns, 
	  c_trns_uidred, 
	  c_trns_pc, 
	  c_trns_ip, 
	  c_trns_mac,

	  f_aud, 
	  b_aud, 
	  c_aud_uid, 
	  c_aud_uidred, 
	  c_aud_pc, 
	  c_aud_ip, 
	  c_aud_mac,

				create_at,
			    id_estado_expediente,
			    id_expediente,
			    estado_recepcionado,
			    estado_preparado,
			    estado_digitalizado,
			    estado_indizado,
			    estado_controlado,
			    estado_fedatado,
			    estado_finalizado,
			    id_disco,
			    mensajes
  )
  VALUES (
    CURRENT_TIMESTAMP, -- Fecha y hora de la transacción
	'D',
	COALESCE(current_setting('myapp.c_trns_uidred', true), current_user), -- Parámetro de sesión para c_trns_uidred
    current_setting('myapp.c_trns_pc', true), -- Parámetro de sesión para c_trns_pc
    COALESCE(current_setting('myapp.c_trns_ip', true), '172.0.0.1'), -- Parámetro de sesión para c_trns_ip
    current_setting('myapp.c_trns_mac', true), -- Parámetro de sesión para c_trns_mac

	OLD.f_aud, 
	OLD.b_aud, 
	OLD.c_aud_uid, 
	OLD.c_aud_uidred, 
	OLD.c_aud_pc, 
	OLD.c_aud_ip, 
	OLD.c_aud_mac,

				OLD.create_at,
			    OLD.id_estado_expediente,
			    OLD.id_expediente,
			    OLD.estado_recepcionado,
			    OLD.estado_preparado,
			    OLD.estado_digitalizado,
			    OLD.estado_indizado,
			    OLD.estado_controlado,
			    OLD.estado_fedatado,
			    OLD.estado_finalizado,
			    OLD.id_disco,
			    OLD.mensajes

  );

  RETURN OLD; -- Devolver OLD en un trigger antes de eliminar
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER utg_t_estado_expediente_del
BEFORE DELETE ON archivo.t_estado_expediente
FOR EACH ROW
EXECUTE FUNCTION archivo.ufn_auditar_t_estado_expediente_del();