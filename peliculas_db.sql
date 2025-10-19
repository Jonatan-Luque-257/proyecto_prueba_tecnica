-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-10-2025 a las 01:43:28
-- Versión del servidor: 10.4.8-MariaDB
-- Versión de PHP: 7.1.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `peliculas_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `peliculas`
--

CREATE TABLE `peliculas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `anio` int(11) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `peliculas`
--

INSERT INTO `peliculas` (`id`, `nombre`, `descripcion`, `anio`, `estado`) VALUES
(1, 'Die Hard', 'Die Hard es una serie de películas de acción que toma su título de la película con la que se inició la serie: Die Hard, estrenada en 1988 y basada en la famosa novela de 1979 Nothing Lasts Forever, de Roderick Thorp.', 1988, 1),
(2, 'Iron Man', 'Un empresario millonario construye un traje blindado y lo usa para combatir el crimen y el terrorismo.', 2008, 0),
(3, 'Tropic Thunder', 'Un grupo de actores filman un largometraje sobre la guerra de Vietnam. El director, incapaz de controlarlos en el set, decide abandonarlos en medio de la selva y filmarlos con cámaras automáticas. Allí, los artistas deben sobrevivir al peligro real apelan', 2008, 1),
(4, 'El Señor de los Anillos: la Comunidad del Anillo', 'Frodo Bolsón es un hobbit al que su tío Bilbo hace portador del poderoso Anillo Único, capaz de otorgar un poder ilimitado al que la posea, con la finalidad de destruirlo. Sin embargo, fuerzas malignas muy poderosas quieren arrebatárselo.', 2002, 1),
(5, 'Misión imposible', 'Se trata de la primera entrega de la serie cinematográfica Misión imposible, que a su vez está basada en la serie de televisión del mismo nombre, creada por Bruce Geller. Fue dirigida por Brian De Palma y protagonizada por Tom Cruise como Ethan Hunt.', 2002, 1),
(6, 'Avatar', 'Un exmarine participa en un programa en un planeta alienígena habitado por los Na’vi.', 2009, 1),
(7, 'Gladiador', 'Un general romano traicionado busca vengarse del emperador corrupto que asesinó a su familia.', 2000, 1),
(8, 'Matrix', 'Un programador descubre que vive en una simulación controlada por máquinas.', 1999, 1),
(9, 'Jurassic Park', 'Un multimillonario crea un parque temático con dinosaurios clonados que pronto escapan de control.', 1993, 1),
(10, 'Titanic', 'Una joven de clase alta se enamora de un artista pobre a bordo del Titanic.', 1997, 1),
(11, 'El Caballero de la Noche', 'Batman enfrenta al Joker, un criminal caótico que busca sumir a Gotham en la anarquía.', 2008, 1),
(12, 'Forrest Gump', 'Un hombre con un corazón puro narra su vida mientras presencia momentos clave de la historia de EE.UU.', 1994, 1),
(13, 'Piratas del Caribe', 'El capitán Jack Sparrow se enfrenta a piratas fantasmas para recuperar su barco.', 2003, 1),
(14, 'El Rey León', 'Un joven león debe reclamar su lugar como rey tras la muerte de su padre.', 1994, 1),
(15, 'Spider-Man', 'Un joven obtiene poderes arácnidos y debe enfrentarse al Duende Verde.', 2002, 1),
(16, 'Los Vengadores', 'Los héroes más poderosos de la Tierra se unen para detener una invasión alienígena.', 2012, 1),
(17, 'Inception', 'Un ladrón especializado en robar ideas a través de los sueños recibe una última misión imposible.', 2010, 1),
(18, 'Interestelar', 'Un grupo de astronautas viaja a través de un agujero de gusano en busca de un nuevo hogar para la humanidad.', 2014, 1),
(19, 'Guardianes de la Galaxia', 'Un grupo de inadaptados se une para salvar la galaxia de un villano intergaláctico.', 2014, 1),
(20, 'Doctor Strange', 'Un neurocirujano aprende las artes místicas tras un accidente que cambia su vida.', 2016, 1),
(21, 'Black Panther', 'El rey de Wakanda debe proteger su nación de amenazas internas y externas.', 2018, 1),
(22, 'Capitán América: El primer vengador', 'Steve Rogers se convierte en el super soldado que liderará a los Vengadores.', 2011, 1),
(23, 'Ant-Man', 'Un ladrón reformado utiliza un traje que le permite encogerse para detener un robo de alta tecnología.', 2015, 1),
(24, 'Thor', 'El dios del trueno es desterrado a la Tierra para aprender humildad.', 2011, 1),
(25, 'Hulk', 'Un científico se transforma en un monstruo verde cada vez que pierde el control.', 2003, 1),
(26, 'Capitán Marvel', 'Una piloto obtiene poderes cósmicos y se une a una guerra galáctica.', 2019, 1),
(27, 'Iron Man 2', 'Tony Stark enfrenta las consecuencias de revelar su identidad como Iron Man.', 2010, 1),
(28, 'Iron Man 3', 'Tony Stark lucha contra un nuevo enemigo mientras lidia con el trauma de los Vengadores.', 2013, 1),
(29, 'Avengers: Endgame', 'Los Vengadores viajan en el tiempo para revertir la destrucción causada por Thanos.', 2019, 1),
(30, 'Shrek', 'Un ogro debe rescatar a una princesa para recuperar su pantano.', 2001, 1),
(31, 'Toy Story', 'Los juguetes cobran vida cuando los humanos no los ven y viven aventuras únicas.', 1995, 1),
(32, 'Buscando a Nemo', 'Un pez payaso cruza el océano para rescatar a su hijo perdido.', 2003, 1),
(33, 'Monsters Inc.', 'Dos monstruos que asustan niños descubren el poder de la risa.', 2001, 1),
(34, 'Up', 'Un anciano y un niño emprenden una aventura volando con una casa sostenida por globos.', 2009, 1),
(35, 'Los Increíbles', 'Una familia de superhéroes intenta vivir una vida normal mientras salva al mundo.', 2004, 1),
(36, 'Frozen', 'Dos hermanas enfrentan los efectos del poder del hielo y el amor fraternal.', 2013, 1),
(37, 'Encanto', 'Una familia mágica en Colombia debe recuperar el poder de su milagro.', 2021, 1),
(38, 'Coco', 'Un niño viaja al mundo de los muertos para descubrir su historia familiar.', 2017, 1),
(39, 'Zootopia', 'Una coneja policía y un zorro estafador resuelven un misterio en una ciudad de animales.', 2016, 1),
(40, 'Ratatouille', 'Una rata con talento para la cocina sueña con convertirse en chef en París.', 2007, 1),
(41, 'Wall-E', 'Un robot solitario limpia la Tierra abandonada mientras descubre el amor y la humanidad.', 2008, 1),
(42, 'Cars', 'Un auto de carreras aprende el valor de la amistad en un pequeño pueblo.', 2006, 1),
(43, 'Soul', 'Un músico busca reencontrar el sentido de la vida después de una experiencia cercana a la muerte.', 2020, 1),
(44, 'Elemental', 'Dos seres opuestos, de fuego y agua, aprenden a convivir en una ciudad diversa.', 2023, 1),
(45, 'Turning Red', 'Una adolescente se transforma en un panda rojo gigante cuando se emociona demasiado.', 2022, 1),
(46, 'Luca', 'Dos jóvenes amigos viven un verano inolvidable en la costa italiana escondiendo su secreto acuático.', 2021, 1),
(47, 'Lightyear', 'La historia del héroe que inspiró al juguete Buzz Lightyear.', 2022, 1),
(48, 'Intensamente', 'Las emociones de una niña intentan mantener el equilibrio durante un cambio importante en su vida.', 2015, 1),
(49, 'Onward', 'Dos hermanos elfos emprenden un viaje para pasar un último día con su padre.', 2020, 1),
(50, 'nuevocampo', 'con Front', 2027, 1),
(51, '112', '121', 211, 1),
(52, '2323dgdgf', '3231112', 2345, 0),
(53, 'gh', 'fghfgwe', 556, 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `peliculas`
--
ALTER TABLE `peliculas`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `peliculas`
--
ALTER TABLE `peliculas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
